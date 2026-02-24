import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

/**
 * @bref Stocke le hash des fichiers vidéo uploadés pour détecter les doublons
 */
const UploadHash = sequelize.define(
  "UploadHash",
  {
    fileHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      field: "file_hash",
    },
  },
  {
    tableName: "upload_hashes",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["file_hash"] }],
  }
);

export default UploadHash;
