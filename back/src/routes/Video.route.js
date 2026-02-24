/**
 * @bref Routes Video — upload YouTube (unlisted) + copyright + Scaleway S3
 */

import express from "express";
import multer from "multer";
import VideoController from "../controllers/VideoController.js";

const videoRouter = express.Router();

/**
 * @bref Multer — stockage en mémoire, formats vidéo acceptés, limite 500 Mo
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format vidéo non supporté (mp4, mov, avi, webm)"), false);
    }
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/videos/upload
 * Upload YouTube (unlisted) + vérification copyright + upload S3
 * Body (multipart/form-data): video (file), title (string, optionnel)
 */
videoRouter.post("/upload", upload.single("video"), VideoController.uploadVideo);

/**
 * GET /api/videos/list
 * Liste toutes les vidéos dans le bucket Scaleway S3
 */
videoRouter.get("/list", VideoController.listVideos);

/**
 * GET /api/videos/download?key=grp1/uuid.mp4
 * Télécharge (stream) une vidéo depuis Scaleway S3
 */
videoRouter.get("/download", VideoController.downloadVideo);

/**
 * DELETE /api/videos/delete
 * Supprime une vidéo depuis Scaleway S3
 * Body: { key: "grp1/uuid.mp4" }
 */
videoRouter.delete("/delete", VideoController.deleteVideo);

/**
 * GET /api/videos/status/:id
 * Retourne le statut de traitement et de vérification copyright d'un upload
 */
videoRouter.get("/status/:id", VideoController.getUploadStatus);

export default videoRouter;
