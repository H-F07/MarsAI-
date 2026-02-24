/**
 * @bref Service Notification - Logique métier pour les notifications
 */

import Notification from "../models/Notification.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

class NotificationService {
  /**
   * @bref Récupère toutes les notifications d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {object} options - Options de filtrage (unread, limit)
   * @returns {Promise<any[]>}
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { unreadOnly = false, limit = 50 } = options;
      
      const where = { userId };
      if (unreadOnly) {
        where.read = false;
      }

      const notifications = await Notification.findAll({
        where,
        limit: parseInt(limit),
        order: [["created_at", "DESC"]],
      });

      return notifications;
    } catch (error) {
      logger.error("Error fetching notifications", { userId, error: error.message });
      throw new AppError("Erreur lors de la récupération des notifications", 500);
    }
  }

  /**
   * @bref Compte les notifications non lues d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<number>}
   */
  async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: {
          userId,
          read: false,
        },
      });

      return count;
    } catch (error) {
      logger.error("Error counting unread notifications", { userId, error: error.message });
      throw new AppError("Erreur lors du comptage des notifications", 500);
    }
  }

  /**
   * @bref Marque une notification comme lue
   * @param {number} notificationId - ID de la notification
   * @param {number} userId - ID de l'utilisateur (vérification de sécurité)
   * @returns {Promise<any>}
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        throw new AppError("Notification non trouvée", 404);
      }

      await notification.update({ read: true });
      logger.info("Notification marked as read", { notificationId, userId });
      return notification;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error marking notification as read", { notificationId, userId, error: error.message });
      throw new AppError("Erreur lors de la mise à jour de la notification", 500);
    }
  }

  /**
   * @bref Marque toutes les notifications d'un utilisateur comme lues
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<number>} - Nombre de notifications mises à jour
   */
  async markAllAsRead(userId) {
    try {
      const [updatedCount] = await Notification.update(
        { read: true },
        {
          where: {
            userId,
            read: false,
          },
        }
      );

      logger.info("All notifications marked as read", { userId, count: updatedCount });
      return updatedCount;
    } catch (error) {
      logger.error("Error marking all notifications as read", { userId, error: error.message });
      throw new AppError("Erreur lors de la mise à jour des notifications", 500);
    }
  }

  /**
   * @bref Crée et envoie une notification (utilisé par EventService pour rappels, etc.)
   * @param {number} userId - ID de l'utilisateur
   * @param {string} type - Type (EVENT_REMINDER, SELECTION_OFFICIELLE, etc.)
   * @param {string} title - Titre
   * @param {string} message - Message
   * @param {number} [relatedId] - ID lié (event, film, etc.)
   * @returns {Promise<any>}
   */
  async createAndSendNotification(userId, type, title, message, relatedId = null) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title: title || "Notification",
        message: message || "",
        relatedId,
      });
      logger.info("Notification created", { userId, type, relatedId });
      return notification;
    } catch (error) {
      logger.error("Error creating notification", { userId, type, error: error.message });
      throw new AppError("Erreur lors de la création de la notification", 500);
    }
  }

  /**
   * @bref Supprime une notification
   * @param {number} notificationId - ID de la notification
   * @param {number} userId - ID de l'utilisateur (vérification de sécurité)
   * @returns {Promise<void>}
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        throw new AppError("Notification non trouvée", 404);
      }

      await notification.destroy();
      logger.info("Notification deleted", { notificationId, userId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error deleting notification", { notificationId, userId, error: error.message });
      throw new AppError("Erreur lors de la suppression de la notification", 500);
    }
  }
}

export default new NotificationService();
