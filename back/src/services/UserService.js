/**
 * @bref Service User - Logique métier pour les utilisateurs
 * Séparation des responsabilités : Controller → Service → Model
 */

import sequelize from "../db/connection.js";
import User from "../models/User.js";
import Film from "../models/Film.js";
import JuryRating from "../models/JuryRating.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

class UserService {
  /**
   * @bref Récupère tous les utilisateurs avec activité (films soumis, votes jury)
   * @returns {Promise<any[]>}
   */
  async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      /**
       * @bref Comptage des films par userId (réalisateurs)
       */
      const filmCounts = await Film.findAll({
        attributes: ["userId", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        group: ["userId"],
        raw: true,
      });

      /**
       * @bref Comptage des notes jury par userId
       */
      const juryRatingCounts = await JuryRating.findAll({
        attributes: ["userId", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        group: ["userId"],
        raw: true,
      });

      const filmsByUserId = Object.fromEntries(
        filmCounts.map((r) => [r.userId ?? r.user_id, Number(r.count)])
      );
      const votesByUserId = Object.fromEntries(
        juryRatingCounts.map((r) => [r.userId ?? r.user_id, Number(r.count)])
      );

      return users.map((u) => {
        const json = u.toJSON ? u.toJSON() : u;
        json.filmsSubmitted = filmsByUserId[u.id] ?? 0;
        json.votesCompleted = votesByUserId[u.id] ?? 0;
        return json;
      });
    } catch (error) {
      logger.error("Error fetching users", { error: error.message });
      throw new AppError("Erreur lors de la récupération des utilisateurs", 500);
    }
  }

  /**
   * @bref Récupère un utilisateur par ID
   * @param {string|number} id - Identifiant utilisateur
   * @returns {Promise<any>}
   */
  async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404);
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error fetching user by ID", { id, error: error.message });
      throw new AppError("Erreur lors de la récupération de l'utilisateur", 500);
    }
  }

  /**
   * @bref Récupère un utilisateur par username
   * @param {string} username - Username
   * @returns {Promise<any|null>}
   */
  async getUserByUsername(username) {
    try {
      const user = await User.findOne({ where: { username } });
      return user;
    } catch (error) {
      logger.error("Error fetching user by username", { username, error: error.message });
      throw new AppError("Erreur lors de la recherche de l'utilisateur", 500);
    }
  }

  /**
   * @bref Crée un nouvel utilisateur
   * @param {any} userData - Données utilisateur (body)
   * @returns {Promise<any>}
   */
  async createUser(userData) {
    try {
      const { email, username, password, role, biography, country, socialLinks, newsletter, preferredLanguage } = userData;

      /**
       * @bref Vérifier si l'utilisateur existe déjà
       */
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw new AppError("Un utilisateur avec cet email ou username existe déjà", 409);
      }

      /**
       * @bref Valider le rôle
       */
      const validRoles = ["ADMIN", "JURY", "REALISATEUR"];
      const finalRole = role && validRoles.includes(role) ? role : "REALISATEUR";

      /**
       * @bref Hasher le mot de passe
       */
      const hashedPassword = await hashPassword(password);

      /**
       * @bref Créer l'utilisateur
       */
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        role: finalRole,
        biography: biography || null,
        country: country || null,
        socialLinks: socialLinks || {},
        newsletter: newsletter === true,
        preferredLanguage: preferredLanguage === "en" ? "en" : "fr",
      });

      logger.info("User created", { userId: newUser.id, email: newUser.email, role: newUser.role });

      /**
       * @bref Retourner sans le mot de passe
       */
      const userResponse = newUser.toJSON();
      delete userResponse.password;
      return userResponse;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error creating user", { error: error.message });
      throw new AppError("Erreur lors de la création de l'utilisateur", 500);
    }
  }

  /**
   * @bref Met à jour un utilisateur
   * @param {string|number} id - Identifiant utilisateur
   * @param {any} userData - Données à mettre à jour
   * @returns {Promise<any>}
   */
  async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404);
      }

      const { email, username, password, role, biography, country, socialLinks, newsletter, preferredLanguage } = userData;

      /**
       * @bref Vérifier si email/username déjà utilisé par un autre utilisateur
       */
      if (email || username) {
        const conditions = [];
        if (email) conditions.push({ email });
        if (username) conditions.push({ username });

        const existingUser = await User.findOne({
          where: {
            [Op.or]: conditions,
            id: { [Op.ne]: id },
          },
        });

        if (existingUser) {
          throw new AppError("Email ou username déjà utilisé", 409);
        }
      }

      /**
       * @bref Mettre à jour les champs
       */
      if (email != null) user.email = email;
      if (username != null) user.username = username;
      if (password != null) user.password = await hashPassword(password);
      if (role != null && ["ADMIN", "JURY", "REALISATEUR"].includes(role)) {
        user.role = role;
      }
      if (biography != null) user.biography = biography;
      if (country != null) user.country = country;
      if (socialLinks != null) user.socialLinks = socialLinks;
      if (newsletter != null) user.newsletter = newsletter;
      if (preferredLanguage != null && ["fr", "en"].includes(preferredLanguage)) {
        user.preferredLanguage = preferredLanguage;
      }

      await user.save();

      logger.info("User updated", { userId: user.id });

      const userResponse = user.toJSON();
      delete userResponse.password;
      return userResponse;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error updating user", { id, error: error.message });
      throw new AppError("Erreur lors de la mise à jour de l'utilisateur", 500);
    }
  }

  /**
   * @bref Supprime un utilisateur
   * @param {string|number} id - Identifiant utilisateur
   * @returns {Promise<{message: string}>}
   */
  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404);
      }

      await user.destroy();

      logger.info("User deleted", { userId: id });

      return { message: "Utilisateur supprimé avec succès" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error deleting user", { id, error: error.message });
      throw new AppError("Erreur lors de la suppression de l'utilisateur", 500);
    }
  }
}

export default new UserService();
