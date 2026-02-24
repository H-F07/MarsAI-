import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

/**
 * @bref Statuts de vérification copyright
 */
const COPYRIGHT_STATUS = [
  "PENDING",    // En attente de vérification copyright
  "APPROVED",   // Pas de copyright détecté, vidéo approuvée
  "REJECTED",   // Copyright détecté, vidéo rejetée
  "FAILED",     // Erreur technique lors de la vérification (quota YouTube, API, etc.)
];

/**
 * @bref Modèle VideoUpload — stocke les uploads de vidéos avec statut copyright
 */
const VideoUpload = sequelize.define(
  "VideoUpload",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
      comment: "Utilisateur qui a uploadé la vidéo (optionnel)",
    },
    filename: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    youtubeVideoId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "ID vidéo YouTube (si upload réussi)",
    },
    s3Key: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "Clé S3 de la vidéo",
    },
    s3Url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "URL S3 de la vidéo",
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "Taille du fichier en octets",
    },
    copyrightStatus: {
      type: DataTypes.ENUM(...COPYRIGHT_STATUS),
      defaultValue: "PENDING",
      allowNull: false,
    },
    copyrightCheckAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "Nombre de tentatives de vérification copyright",
    },
    lastCopyrightCheckAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de la dernière vérification copyright",
    },
    copyrightDetectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de détection du copyright (si détecté)",
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Raison du rejet (si copyright détecté)",
    },
  },
  {
    tableName: "video_uploads",
    underscored: true,
    timestamps: true,
    indexes: [
      { name: "video_uploads_user_id_idx", fields: ["user_id"] },
      { name: "video_uploads_copyright_status_idx", fields: ["copyright_status"] },
      { name: "video_uploads_youtube_video_id_idx", fields: ["youtube_video_id"] },
      { name: "video_uploads_created_at_idx", fields: ["created_at"] },
    ],
  }
);

export default VideoUpload;
