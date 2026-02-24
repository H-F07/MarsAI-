/**
 * @bref Middlewares de validation centralisée
 * Utilisent next(error) pour propager les erreurs au errorHandler
 */

import { AppError } from "./errorHandler.js";

/**
 * @bref Valide les champs requis dans req.body
 * @param {string[]} fields - Liste des champs obligatoires
 * @returns {(req: any, res: any, next: Function) => void} Middleware Express
 */
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });
    if (missing.length > 0) {
      return next(new AppError(`Champs manquants: ${missing.join(", ")}`, 400));
    }
    next();
  };
};

/**
 * @bref Valide le format email
 * @param {any} req - Requête Express
 * @param {any} res - Réponse Express
 * @param {Function} next - Next middleware
 * @returns {void}
 */
export const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return next(new AppError("Format email invalide", 400));
  }
  next();
};

/**
 * @bref Valide le format YouTube ID (11 caractères alphanumériques)
 * @param {any} req - Requête Express
 * @param {any} res - Réponse Express
 * @param {Function} next - Next middleware
 * @returns {void}
 */
export const validateYouTubeId = (req, res, next) => {
  const youtubeRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (req.body.youtubeId && !youtubeRegex.test(req.body.youtubeId)) {
    return next(new AppError("Format YouTube ID invalide (11 caractères requis)", 400));
  }
  next();
};

/**
 * @bref Valide le rôle utilisateur
 * @param {any} req - Requête Express
 * @param {any} res - Réponse Express
 * @param {Function} next - Next middleware
 * @returns {void}
 */
export const validateRole = (req, res, next) => {
  const validRoles = ["ADMIN", "JURY", "REALISATEUR"];
  if (req.body.role && !validRoles.includes(req.body.role)) {
    return next(new AppError(`Rôle invalide. Rôles valides: ${validRoles.join(", ")}`, 400));
  }
  next();
};

/**
 * @bref Valide le code pays ISO (2-3 caractères majuscules)
 * @param {any} req - Requête Express
 * @param {any} res - Réponse Express
 * @param {Function} next - Next middleware
 * @returns {void}
 */
export const validateCountryCode = (req, res, next) => {
  if (req.body.country) {
    const upper = req.body.country.toUpperCase();
    const countryRegex = /^[A-Z]{2,3}$/;
    if (!countryRegex.test(upper)) {
      return next(new AppError("Code pays invalide (format ISO 2-3 caractères)", 400));
    }
    req.body.country = upper;
  }
  next();
};

/**
 * @bref Valide la durée du film (1-60 secondes)
 * @param {any} req - Requête Express
 * @param {any} res - Réponse Express
 * @param {Function} next - Next middleware
 * @returns {void}
 */
export const validateDuration = (req, res, next) => {
  if (req.body.duration !== undefined) {
    const duration = parseInt(req.body.duration);
    if (isNaN(duration) || duration < 1 || duration > 60) {
      return next(new AppError("Durée invalide (1-60 secondes)", 400));
    }
    req.body.duration = duration;
  }
  next();
};

/**
 * @bref Valide la note qualitative du jury (4 étapes)
 * Valeurs acceptées : TRES_BIEN | BIEN | BOF | JAIME_PAS
 * @param {any} req - Requête Express
 * @param {any} res - Réponse Express
 * @param {Function} next - Next middleware
 * @returns {void}
 */
export const validateRating = (req, res, next) => {
  const VALID_RATINGS = ["TRES_BIEN", "BIEN", "BOF", "JAIME_PAS"];
  if (req.body.score !== undefined) {
    if (!VALID_RATINGS.includes(req.body.score)) {
      return next(
        new AppError(
          `Note invalide. Valeurs acceptées : ${VALID_RATINGS.join(", ")}`,
          400
        )
      );
    }
  }
  next();
};
