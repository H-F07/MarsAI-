/**
 * @bref Routes Event - Gestion des événements (Admin uniquement)
 */

import express from "express";
import EventController from "../controllers/EventController.js";
import { requireAuth } from "../middlewares/AuthMiddleware.js";
import { validateRequired } from "../middlewares/validation.js";

const eventRouter = express.Router();

/**
 * @bref Toutes les routes nécessitent l'authentification Admin
 */
eventRouter.use(requireAuth(["ADMIN"]));

/**
 * @bref Routes
 */
eventRouter.get("/", EventController.getEvents);
eventRouter.get("/:id", EventController.getEventById);
eventRouter.post(
  "/",
  validateRequired(["title", "type", "date", "startTime", "endTime"]),
  EventController.createEvent
);
eventRouter.put("/:id", EventController.updateEvent);
eventRouter.delete("/:id", EventController.deleteEvent);

export default eventRouter;
