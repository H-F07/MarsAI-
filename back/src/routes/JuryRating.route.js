/**
 * @bref Routes JuryRating - Votes du jury sur les films finalistes
 */

import express from "express";
import JuryRatingController from "../controllers/JuryRatingController.js";
import { requireAuth } from "../middlewares/AuthMiddleware.js";
import { validateRequired, validateRating } from "../middlewares/validation.js";

const juryRatingRouter = express.Router();

/**
 * @bref Routes juré — nécessite le rôle JURY
 */

// Soumettre ou modifier son vote pour un film (upsert — revenir sur un vote)
juryRatingRouter.post(
  "/films/:filmId",
  requireAuth(["JURY"]),
  validateRequired(["score"]),
  validateRating,
  JuryRatingController.submitRating
);

// Récupérer son vote pour un film précis (pré-remplissage du formulaire)
juryRatingRouter.get(
  "/films/:filmId/my-rating",
  requireAuth(["JURY"]),
  JuryRatingController.getMyRatingForFilm
);

// Récupérer tous ses votes (tableau de bord progression)
juryRatingRouter.get(
  "/my-ratings",
  requireAuth(["JURY"]),
  JuryRatingController.getMyRatings
);

/**
 * @bref Routes admin — consultation des votes pour délibération
 */

// Récupérer tous les votes pour un film (tous les jurés)
juryRatingRouter.get(
  "/films/:filmId",
  requireAuth(["ADMIN"]),
  JuryRatingController.getRatingsByFilm
);

export default juryRatingRouter;
