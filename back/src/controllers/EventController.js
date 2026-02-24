/**
 * @bref Contrôleur Event - Gestion des événements
 */

import EventService from "../services/EventService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

/**
 * @bref Récupère tous les événements
 */
export const getEvents = asyncHandler(async (req, res) => {
  try {
    const events = await EventService.getAllEvents();
    logger.info("Events fetched", { count: events.length });
    res.json(events);
  } catch (error) {
    logger.error("Error in getEvents controller", { error: error.message, stack: error.stack });
    throw error;
  }
});

/**
 * @bref Récupère un événement par ID
 */
export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await EventService.getEventById(id);
  logger.info("Event fetched by ID", { eventId: id });
  res.json(event);
});

/**
 * @bref Crée un nouvel événement
 */
export const createEvent = asyncHandler(async (req, res) => {
  const event = await EventService.createEvent(req.body);
  logger.info("Event created", { eventId: event.id });
  res.status(201).json({
    message: "Événement créé avec succès",
    event,
  });
});

/**
 * @bref Met à jour un événement
 */
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await EventService.updateEvent(id, req.body);
  logger.info("Event updated", { eventId: id });
  res.json(event);
});

/**
 * @bref Supprime un événement
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await EventService.deleteEvent(id);
  logger.info("Event deleted", { eventId: id });
  res.status(204).send();
});

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
