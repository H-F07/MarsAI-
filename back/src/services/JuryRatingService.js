/**
 * @bref Service JuryRating - Logique métier pour les votes du jury
 * Gère la soumission, la modification et la consultation des notes
 */

import JuryRating, { JURY_RATING_VALUES } from "../models/JuryRating.js";
import User from "../models/User.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

class JuryRatingService {
  /**
   * @bref Soumet ou modifie un vote (upsert)
   * Si le juré a déjà voté pour ce film, son vote est mis à jour (revenir sur un vote)
   * @param {number} filmId - Identifiant du film
   * @param {number} userId - Identifiant du juré
   * @param {string} score - Valeur ENUM : TRES_BIEN | BIEN | BOF | JAIME_PAS
   * @param {string|null} internalComment - Commentaire interne optionnel
   * @returns {Promise<{rating: any, isNew: boolean}>}
   */
  async submitRating(filmId, userId, score, internalComment = null) {
    try {
      /**
       * @bref Valider la valeur du score
       */
      if (!JURY_RATING_VALUES.includes(score)) {
        throw new AppError(
          `Score invalide. Valeurs acceptées : ${JURY_RATING_VALUES.join(", ")}`,
          400
        );
      }

      /**
       * @bref Chercher un vote existant pour cet utilisateur / ce film
       */
      let existing = await JuryRating.findOne({ where: { filmId, userId } });

      if (existing) {
        /**
         * @bref Vote existant : mise à jour (revenir sur son vote)
         */
        existing.score = score;
        existing.internalComment = internalComment;
        await existing.save();

        logger.info("JuryRating updated", { filmId, userId, score });
        return { rating: existing, isNew: false };
      }

      /**
       * @bref Aucun vote précédent : création
       */
      const rating = await JuryRating.create({
        filmId,
        userId,
        score,
        internalComment,
      });

      logger.info("JuryRating created", { filmId, userId, score });
      return { rating, isNew: true };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error submitting jury rating", { error: error.message });
      throw new AppError("Erreur lors de la soumission du vote", 500);
    }
  }

  /**
   * @bref Récupère le vote d'un juré pour un film précis
   * @param {number} filmId - Identifiant du film
   * @param {number} userId - Identifiant du juré
   * @returns {Promise<any|null>}
   */
  async getRatingByFilmAndUser(filmId, userId) {
    try {
      const rating = await JuryRating.findOne({ where: { filmId, userId } });
      return rating;
    } catch (error) {
      logger.error("Error fetching jury rating", { error: error.message });
      throw new AppError("Erreur lors de la récupération du vote", 500);
    }
  }

  /**
   * @bref Récupère tous les votes d'un juré (tableau de bord de progression)
   * @param {number} userId - Identifiant du juré
   * @returns {Promise<any[]>}
   */
  async getMyRatings(userId) {
    try {
      const ratings = await JuryRating.findAll({
        where: { userId },
        order: [["updated_at", "DESC"]],
      });

      return ratings;
    } catch (error) {
      logger.error("Error fetching my ratings", { error: error.message });
      throw new AppError("Erreur lors de la récupération de vos votes", 500);
    }
  }

  /**
   * @bref Récupère toutes les notes pour un film (admin uniquement — délibération)
   * @param {number} filmId - Identifiant du film
   * @returns {Promise<any[]>}
   */
  async getRatingsByFilm(filmId) {
    try {
      const ratings = await JuryRating.findAll({
        where: { filmId },
        include: [
          {
            model: User,
            attributes: ["id", "username"],
          },
        ],
        order: [["created_at", "ASC"]],
      });

      return ratings;
    } catch (error) {
      logger.error("Error fetching ratings by film", { error: error.message });
      throw new AppError("Erreur lors de la récupération des votes du film", 500);
    }
  }
}

export default new JuryRatingService();
