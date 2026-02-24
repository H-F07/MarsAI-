/**
 * @bref Routes Notification - Gestion des notifications utilisateur
 */

import express from "express";
import NotificationController from "../controllers/NotificationController.js";
import { requireAuth } from "../middlewares/AuthMiddleware.js";

const notificationRouter = express.Router();

/**
 * @bref Toutes les routes nécessitent l'authentification
 */
notificationRouter.use(requireAuth());

/**
 * @bref Routes
 */
notificationRouter.get("/", NotificationController.getNotifications);
notificationRouter.get("/unread-count", NotificationController.getUnreadCount);
notificationRouter.patch("/:id/read", NotificationController.markAsRead);
notificationRouter.patch("/read-all", NotificationController.markAllAsRead);
notificationRouter.delete("/:id", NotificationController.deleteNotification);
/** Route de test (dev uniquement) : POST /api/notifications/test */
notificationRouter.post("/test", NotificationController.createTestNotification);


export default notificationRouter;
