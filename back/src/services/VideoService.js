/**
 * @bref Service Video — upload YouTube (unlisted) + vérification copyright + Scaleway S3
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { google } from "googleapis";
import { Readable } from "stream";
import crypto from "crypto";
import path from "path";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

const BUCKET_NAME = process.env.SCW_BUCKET_NAME;
const FOLDER = process.env.SCW_FOLDER || "grp1";

const s3Client = new S3Client({
  region: process.env.SCW_REGION || "fr-par",
  endpoint: process.env.SCW_ENDPOINT || "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY_ID,
    secretAccessKey: process.env.SCW_SECRET_ACCESS_KEY,
  },
});

// ─── YouTube ─────────────────────────────────────────────────────────────────

/**
 * @brief Crée un client YouTube OAuth2 authentifié
 * @returns {google.youtube} Client YouTube authentifié
 */
function createYoutubeClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.youtube({ version: "v3", auth: oauth2Client });
}

/**
 * @brief Upload une vidéo sur YouTube en mode unlisted
 * @param {Object} file - Fichier vidéo (buffer, mimetype, originalname)
 * @param {string} title - Titre de la vidéo
 * @returns {Promise<{youtubeVideoId: string}>} ID de la vidéo YouTube
 */
async function uploadToYoutube(file, title) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new AppError("Credentials Google OAuth2 manquants", 500);
  }

  const youtube = createYoutubeClient();

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: title || file.originalname,
        description: "Vidéo uploadée pour vérification copyright",
      },
      status: { privacyStatus: "unlisted" },
    },
    media: {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    },
  });

  const youtubeVideoId = response.data.id;
  if (!youtubeVideoId) throw new AppError("YouTube n'a pas retourné d'ID vidéo", 502);

  logger.info("YouTube upload success", { youtubeVideoId });
  return { youtubeVideoId };
}

/**
 * @brief Vérifie le copyright via YouTube Data API
 * @param {string} youtubeVideoId - ID de la vidéo YouTube
 * @returns {Promise<{safe: boolean, videoId: string}>} Résultat de la vérification
 * @throws {AppError} Si copyright détecté (422) ou vidéo en traitement (503)
 */
async function checkYoutubeCopyright(youtubeVideoId) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new AppError("Clé YouTube API manquante", 500);

  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${encodeURIComponent(youtubeVideoId)}&key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) throw new AppError(`Erreur YouTube API: ${response.status}`, 502);

  const data = await response.json();
  if (!data.items?.length) throw new AppError("Vidéo YouTube introuvable", 422);

  const { contentDetails, status } = data.items[0];
  const licensedContent = contentDetails?.licensedContent === true;
  const blockedRegions = contentDetails?.regionRestriction?.blocked || [];
  const uploadStatus = status?.uploadStatus;

  logger.info("Copyright check", {
    youtubeVideoId,
    licensedContent,
    blockedRegionsCount: blockedRegions.length,
    uploadStatus,
  });

  // Détection copyright
  if (licensedContent) {
    throw new AppError("Copyright détecté : licensedContent = true", 422);
  }

  if (blockedRegions.length > 100) {
    throw new AppError(`Copyright détecté : ${blockedRegions.length} pays bloqués (restriction de région)`, 422);
  }

  // Vidéo pas encore traitée → retry plus tard
  if (uploadStatus === "uploaded") {
    throw new AppError("Vidéo encore en cours de traitement par YouTube", 503);
  }

  return { safe: true, videoId: youtubeVideoId };
}

// ─── Scaleway S3 ─────────────────────────────────────────────────────────────

/**
 * @brief Liste toutes les vidéos dans le bucket Scaleway S3
 * @returns {Promise<Array>} Liste des fichiers vidéo
 */
async function listVideos() {
  const command = new ListObjectsCommand({ Bucket: BUCKET_NAME, Prefix: `${FOLDER}/` });
  const response = await s3Client.send(command);
  return (response.Contents || []).map((item) => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified,
    url: `${process.env.SCW_ENDPOINT}/${BUCKET_NAME}/${item.Key}`,
  }));
}

/**
 * @brief Upload un fichier vidéo vers Scaleway S3
 * @param {Express.Multer.File} file - Fichier vidéo
 * @returns {Promise<{s3Url: string, key: string}>} URL S3 et clé du fichier
 */
async function uploadToS3(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueKey = `${FOLDER}/${crypto.randomUUID()}${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: uniqueKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  const s3Url = `${process.env.SCW_ENDPOINT}/${BUCKET_NAME}/${uniqueKey}`;
  logger.info("S3 upload success", { key: uniqueKey });
  return { s3Url, key: uniqueKey };
}

/**
 * @brief Télécharge une vidéo depuis Scaleway S3
 * @param {string} key - Clé du fichier dans S3 (ex: grp1/uuid.mp4)
 * @returns {Promise<{stream: Readable, contentType: string, contentLength: number}>} Stream et métadonnées
 */
async function downloadFromS3(key) {
  const response = await s3Client.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
  return {
    stream: response.Body,
    contentType: response.ContentType,
    contentLength: response.ContentLength,
  };
}

/**
 * @brief Supprime une vidéo depuis Scaleway S3
 * @param {string} key - Clé du fichier dans S3 (ex: grp1/uuid.mp4)
 * @returns {Promise<void>}
 */
async function deleteFromS3(key) {
  await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
  logger.info("S3 delete success", { key });
}

/**
 * @brief Calcule le hash SHA-256 du fichier pour détecter les doublons
 * @param {Buffer} buffer - Contenu du fichier
 * @returns {string} Hash hexadécimal (64 caractères)
 */
function computeFileHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export default {
  uploadToYoutube,
  checkYoutubeCopyright,
  listVideos,
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  computeFileHash,
};
