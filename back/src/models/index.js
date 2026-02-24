/**
 * Index des modèles - Plateforme marsAI (CdC Lyon NERD)
 * Centralise les associations et l'export des modèles.
 */

import sequelize from "../db/connection.js";
import User from "./User.js";
import Film from "./Film.js";
import JuryRating from "./JuryRating.js";
import NewsletterSubscriber from "./NewsletterSubscriber.js";
import Event from "./Event.js";
import EventRegistration from "./EventRegistration.js";
import Notification from "./Notification.js";
import SubmissionConfig from "./SubmissionConfig.js";

/**
 * @bref Associations
 */

/**
 * @bref User <-> Film (Réalisateur soumet des films)
 */
User.hasMany(Film, { foreignKey: "userId" });
Film.belongsTo(User, { foreignKey: "userId" });

/**
 * @bref User <-> JuryRating <-> Film (Jury note les finalistes)
 */
User.hasMany(JuryRating, { foreignKey: "userId" });
JuryRating.belongsTo(User, { foreignKey: "userId" });
Film.hasMany(JuryRating, { foreignKey: "filmId" });
JuryRating.belongsTo(Film, { foreignKey: "filmId" });

/**
 * @bref Newsletter (optionnel : lié à User ou email seul)
 */
User.hasOne(NewsletterSubscriber, { foreignKey: "userId" });
NewsletterSubscriber.belongsTo(User, { foreignKey: "userId" });

/**
 * @bref Event <-> EventRegistration <-> User (réservations)
 */
Event.hasMany(EventRegistration, { foreignKey: "eventId" });
EventRegistration.belongsTo(Event, { foreignKey: "eventId" });
User.hasMany(EventRegistration, { foreignKey: "userId" });
EventRegistration.belongsTo(User, { foreignKey: "userId" });

/**
 * @bref Qui a scanné le QR (admin/agent) — association optionnelle
 */
User.hasMany(EventRegistration, {
  foreignKey: "checkedInByUserId",
  as: "eventCheckIns",
});
EventRegistration.belongsTo(User, {
  foreignKey: "checkedInByUserId",
  as: "checkedInBy",
});

/**
 * @bref Notifications
 */
User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

export {
  sequelize,
  User,
  Film,
  JuryRating,
  NewsletterSubscriber,
  Event,
  EventRegistration,
  Notification,
  SubmissionConfig,
};

export default {
  sequelize,
  User,
  Film,
  JuryRating,
  NewsletterSubscriber,
  Event,
  EventRegistration,
  Notification,
  SubmissionConfig,
};
