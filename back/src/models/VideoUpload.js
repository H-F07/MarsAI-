import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

/**
 * Suivi des uploads vidéo et de leur vérification copyright
 * Statuts : PENDING → APPROVED | REJECTED | FAILED
 */
const VideoUpload = sequelize.define(
  "VideoUpload",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    s3Key: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    s3Url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    youtubeVideoId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    copyrightStatus: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "FAILED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    copyrightCheckAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    lastCopyrightCheckAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    copyrightDetectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "video_uploads",
    underscored: true,
    timestamps: true,
    indexes: [
      { name: "video_uploads_user_id_idx", fields: ["user_id"] },
      { name: "video_uploads_copyright_status_idx", fields: ["copyright_status"] },
    ],
  }
);

export default VideoUpload;
