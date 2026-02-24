/**
 * @bref Contrôleur JuryRating - Gestion des votes du jury
 * Soumettre / modifier un vote, consulter les votes (juré ou admin)
 */

import JuryRatingService from "../services/JuryRatingService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

/**
 * @bref Soumet ou modifie le vote d'un juré pour un film (upsert)
 * Permet également de revenir sur un vote existant
 */
export const submitRating = asyncHandler(async (req, res) => {
  /**
   * @bref userId injecté par le middleware d'auth (JURY uniquement)
   */
  const userId = req.user.id;
  const { filmId } = req.params;
  const { score, internalComment } = req.body;

  const { rating, isNew } = await JuryRatingService.submitRating(
    parseInt(filmId),
    userId,
    score,
    internalComment || null
  );

  logger.info("Jury rating submitted", { filmId, userId, score, isNew });

  res.status(isNew ? 201 : 200).json({
    message: isNew ? "Vote enregistré avec succès" : "Vote mis à jour avec succès",
    rating,
  });
});

/**
 * @bref Récupère le vote d'un juré pour un film précis
 * Utilisé pour pré-remplir le formulaire si le juré a déjà voté
 */
export const getMyRatingForFilm = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { filmId } = req.params;

  const rating = await JuryRatingService.getRatingByFilmAndUser(
    parseInt(filmId),
    userId
  );

  logger.info("Jury rating fetched by film and user", { filmId, userId });

  res.json({ rating: rating || null });
});

/**
 * @bref Récupère tous les votes du juré connecté (progression personnelle)
 */
export const getMyRatings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const ratings = await JuryRatingService.getMyRatings(userId);
  logger.info("My ratings fetched", { userId, count: ratings.length });

  res.json(ratings);
});

/**
 * @bref Récupère tous les votes pour un film (admin — délibération)
 */
export const getRatingsByFilm = asyncHandler(async (req, res) => {
  const { filmId } = req.params;

  const ratings = await JuryRatingService.getRatingsByFilm(parseInt(filmId));
  logger.info("Ratings by film fetched", { filmId, count: ratings.length });

  res.json(ratings);
});

export default {
  submitRating,
  getMyRatingForFilm,
  getMyRatings,
  getRatingsByFilm,
};
