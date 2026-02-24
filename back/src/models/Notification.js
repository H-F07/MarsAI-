import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

/**
 * Alertes utilisateurs (CdC §10 - Bonus)
 * WebSockets : Film validé/refusé, Annonce Sélection officielle.
 */
const Notification = sequelize.define(
  "Notification",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM(
        "FILM_VALIDATED",
        "FILM_REJECTED",
        "SELECTION_OFFICIELLE",
        "EVENT_REMINDER",
        "VIDEO_UPLOAD_APPROVED",
        "VIDEO_UPLOAD_REJECTED",
        "VIDEO_UPLOAD_FAILED"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID film ou event selon type",
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "notifications",
    underscored: true,
    timestamps: true,
    indexes: [
      { name: "notifications_user_id_idx", fields: ["user_id"] },
      { name: "notifications_read_idx", fields: ["read"] },
    ],
  }
);

export default Notification;
