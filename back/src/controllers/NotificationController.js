/**
 * @bref Contrôleur Notification - Gestion des notifications utilisateur
 */

import NotificationService from "../services/NotificationService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

/**
 * @bref Récupère toutes les notifications de l'utilisateur connecté
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { unreadOnly } = req.query;

  const notifications = await NotificationService.getUserNotifications(userId, {
    unreadOnly: unreadOnly === "true",
    limit: 50,
  });

  logger.info("Notifications fetched", { userId, count: notifications.length });
  res.json(notifications);
});

/**
 * @bref Récupère le nombre de notifications non lues
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const count = await NotificationService.getUnreadCount(userId);
  res.json({ count });
});

/**
 * @bref Marque une notification comme lue
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await NotificationService.markAsRead(id, userId);
  res.json(notification);
});

/**
 * @bref Marque toutes les notifications comme lues
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const count = await NotificationService.markAllAsRead(userId);
  res.json({ message: `${count} notifications marquées comme lues`, count });
});

/**
 * @bref Supprime une notification
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await NotificationService.deleteNotification(id, userId);
  res.status(204).send();
});

/**
 * @bref [DEV] Crée une notification de test pour l'utilisateur connecté
 * Utilisable uniquement si NODE_ENV !== 'production'
 */
export const createTestNotification = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Non disponible en production" });
  }
  const userId = req.user.id;
  const { type } = req.body || {};
  const types = [
    "FILM_VALIDATED",
    "FILM_REJECTED",
    "SELECTION_OFFICIELLE",
    "EVENT_REMINDER",
    "VIDEO_UPLOAD_APPROVED",
    "VIDEO_UPLOAD_REJECTED",
    "VIDEO_UPLOAD_FAILED",
  ];
  const chosen = types.includes(type) ? type : types[Math.floor(Math.random() * types.length)];
  const samples = {
    FILM_VALIDATED: { title: "Film validé", message: "Votre film « Test » a été validé par le jury." },
    FILM_REJECTED: { title: "Film refusé", message: "Votre film n'a pas été retenu pour cette édition." },
    SELECTION_OFFICIELLE: { title: "Sélection officielle", message: "Votre film fait partie de la sélection officielle." },
    EVENT_REMINDER: { title: "Rappel événement", message: "L'événement « Soirée MarsAI » commence demain à 19h." },
    VIDEO_UPLOAD_APPROVED: { title: "Vidéo approuvée", message: "Votre vidéo a été approuvée." },
    VIDEO_UPLOAD_REJECTED: { title: "Vidéo rejetée", message: "Votre vidéo a été rejetée (copyright)." },
    VIDEO_UPLOAD_FAILED: { title: "Vidéo non traitée", message: "La vérification de votre vidéo a échoué." },
  };
  const { title, message } = samples[chosen];
  const notification = await NotificationService.createAndSendNotification(userId, chosen, title, message, null);
  logger.info("Test notification created", { userId, type: chosen });
  res.status(201).json(notification);
});

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createTestNotification,
};
