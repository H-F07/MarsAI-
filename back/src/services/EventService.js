/**
 * @bref Service Event - Logique métier pour les événements
 */

import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import User from "../models/User.js";
import NotificationService from "./NotificationService.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

class EventService {
  /**
   * @bref Récupère tous les événements
   * @returns {Promise<any[]>}
   */
  async getAllEvents() {
    try {
      const events = await Event.findAll({
        order: [["created_at", "DESC"]],
      });

      const eventsWithRegistrations = await Promise.all(
        events.map(async (event) => {
          let registrations = 0;
          try {
            registrations = await EventRegistration.count({
              where: { eventId: event.id },
            });
          } catch (err) {
            logger.warn("Could not count registrations", { eventId: event.id, error: err.message });
          }

          const json = event.toJSON ? event.toJSON() : event;
          json.ticketsSold = registrations;
          return json;
        })
      );

      return eventsWithRegistrations;
    } catch (error) {
      logger.error("Error fetching events", { 
        error: error.message, 
        stack: error.stack,
        name: error.name 
      });
      throw new AppError(`Erreur lors de la récupération des événements: ${error.message}`, 500);
    }
  }

  /**
   * @bref Récupère un événement par ID
   * @param {string|number} id - Identifiant événement
   * @returns {Promise<any>}
   */
  async getEventById(id) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new AppError("Événement non trouvé", 404);
      }

      let registrations = 0;
      try {
        registrations = await EventRegistration.count({
          where: { eventId: id },
        });
      } catch (err) {
        logger.warn("Could not count registrations", { eventId: id, error: err.message });
      }

      const json = event.toJSON ? event.toJSON() : event;
      json.ticketsSold = registrations;
      return json;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error fetching event by ID", { id, error: error.message });
      throw new AppError("Erreur lors de la récupération de l'événement", 500);
    }
  }

  /**
   * @bref Crée un nouvel événement
   * @param {any} eventData - Données événement
   * @returns {Promise<any>}
   */
  async createEvent(eventData) {
    try {
      const {
        title,
        type,
        description,
        date,
        startTime,
        endTime,
        location,
        capacity,
        status,
      } = eventData;

      const newEvent = await Event.create({
        title,
        type,
        description: description || null,
        date,
        startTime,
        endTime,
        location: location || null,
        capacity: capacity || 0,
        status: status || "upcoming",
      });

      logger.info("Event created", { eventId: newEvent.id, title: newEvent.title });

      const registrations = await EventRegistration.count({
        where: { eventId: newEvent.id },
      }).catch(() => 0);

      const json = newEvent.toJSON();
      json.ticketsSold = registrations;
      return json;
    } catch (error) {
      logger.error("Error creating event", { 
        error: error.message, 
        stack: error.stack,
        name: error.name,
        data: eventData 
      });
      throw new AppError(`Erreur lors de la création de l'événement: ${error.message}`, 500);
    }
  }

  /**
   * @bref Met à jour un événement
   * @param {string|number} id - Identifiant événement
   * @param {any} eventData - Données à mettre à jour
   * @returns {Promise<any>}
   */
  async updateEvent(id, eventData) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new AppError("Événement non trouvé", 404);
      }

      const {
        title,
        type,
        description,
        date,
        startTime,
        endTime,
        location,
        capacity,
        status,
      } = eventData;

      const oldStatus = event.status;

      if (title != null) event.title = title;
      if (type != null) event.type = type;
      if (description != null) event.description = description;
      if (date != null) event.date = date;
      if (startTime != null) event.startTime = startTime;
      if (endTime != null) event.endTime = endTime;
      if (location != null) event.location = location;
      if (capacity != null) event.capacity = capacity;
      if (status != null) event.status = status;

      await event.save();

      /**
       * @bref Envoyer notification si statut change vers "confirmed" ou "cancelled"
       */
      if (status && status !== oldStatus) {
        try {
          if (status === "confirmed") {
            await this.notifyRegisteredUsers(
              id,
              "Événement confirmé",
              `L'événement "${event.title}" a été confirmé. Détails: ${location || "Lieu à confirmer"} le ${date}`
            );
          } else if (status === "cancelled") {
            await this.notifyRegisteredUsers(
              id,
              "Événement annulé",
              `L'événement "${event.title}" a été annulé.`
            );
          }
        } catch (err) {
          logger.warn("Error sending event status notification", { eventId: id, newStatus: status, error: err.message });
        }
      }

      const registrations = await EventRegistration.count({
        where: { eventId: id },
      });

      logger.info("Event updated", { eventId: event.id });

      const json = event.toJSON();
      json.ticketsSold = registrations;
      return json;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error updating event", { id, error: error.message });
      throw new AppError("Erreur lors de la mise à jour de l'événement", 500);
    }
  }

  /**
   * @bref Supprime un événement
   * @param {string|number} id - Identifiant événement
   * @returns {Promise<{message: string}>}
   */
  async deleteEvent(id) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new AppError("Événement non trouvé", 404);
      }

      try {
        await EventRegistration.destroy({ where: { eventId: id } });
      } catch (err) {
        logger.warn("Could not delete registrations", { eventId: id, error: err.message });
      }
      await event.destroy();

      logger.info("Event deleted", { eventId: id });

      return { message: "Événement supprimé avec succès" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error deleting event", { id, error: error.message });
      throw new AppError("Erreur lors de la suppression de l'événement", 500);
    }
  }

  /**
   * @bref Envoie une notification aux utilisateurs inscrits à un événement
   * @param {number} eventId - ID de l'événement
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @returns {Promise<number>} - Nombre de notifications envoyées
   */
  async notifyRegisteredUsers(eventId, title, message) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        throw new AppError("Événement non trouvé", 404);
      }

      /**
       * @bref Récupérer les utilisateurs inscrits
       */
      const registrations = await EventRegistration.findAll({
        where: { eventId },
        attributes: ["userId"],
      });

      const userIds = registrations.map(r => r.userId);
      let notificationCount = 0;

      /**
       * @bref Envoyer une notification à chaque utilisateur inscrit
       */
      for (const userId of userIds) {
        try {
          await NotificationService.createAndSendNotification(
            userId,
            "EVENT_REMINDER",
            title,
            message,
            eventId
          );
          notificationCount++;
        } catch (err) {
          logger.warn("Error sending notification to user", { userId, eventId, error: err.message });
        }
      }

      logger.info("Event notifications sent", { eventId, count: notificationCount });
      return notificationCount;
    } catch (error) {
      logger.error("Error notifying registered users", { eventId, error: error.message });
      throw error;
    }
  }
}

export default new EventService();
