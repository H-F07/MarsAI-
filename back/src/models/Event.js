import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

/**
 * Module Événement Physique (CdC §11 - Bonus)
 * Agenda 2 jours : projections, conférences, workshops.
 * Jauge participants, réservations. Clôture 13 juin à Marseille.
 */
const Event = sequelize.define(
  "Event",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("screening", "workshop", "masterclass", "concert", "party"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Date de l'événement (YYYY-MM-DD)",
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "Heure de début (HH:MM)",
    },
    endTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "Heure de fin (HH:MM)",
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Capacité maximale",
    },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "upcoming",
    },
  },
  {
    tableName: "events",
    underscored: true,
    timestamps: true,
  }
);

export default Event;
