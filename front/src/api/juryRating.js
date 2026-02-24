import instance from "./config.js";

/**
 * Soumet ou modifie un vote pour un film (upsert)
 * @param {number|string} filmId
 * @param {string} score - TRES_BIEN | BIEN | BOF | JAIME_PAS
 * @param {string} internalComment - Optionnel
 */
export const submitRating = (filmId, score, internalComment = "") =>
  instance.post(`/jury-ratings/films/${filmId}`, { score, internalComment });

/**
 * Récupère le vote du juré connecté pour un film précis
 * @param {number|string} filmId
 */
export const fetchMyRatingForFilm = (filmId) =>
  instance.get(`/jury-ratings/films/${filmId}/my-rating`);

/**
 * Récupère tous les votes du juré connecté (pour le dashboard)
 */
export const fetchMyRatings = () =>
  instance.get("/jury-ratings/my-ratings");
