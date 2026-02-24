import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

/**
 * Valeurs possibles pour la notation jury (CdC §3.3 — modifié)
 * Remplacement de la note 1-10 par un système en 4 étapes
 */
const JURY_RATING_VALUES = ["TRES_BIEN", "BIEN", "BOF", "JAIME_PAS"];

/**
 * Notation du Jury (CdC §3.3)
 * - Accès à la liste des 50 films finalistes (SELECTION_OFFICIELLE)
 * - Note en 4 étapes : Très bien / Bien / Bof / J'aime pas
 * - Commentaires internes (non publics) pour délibération
 * - Possibilité de revenir sur son vote (upsert via service)
 */
const JuryRating = sequelize.define(
  "JuryRating",
  {
    filmId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    // Note qualitative en 4 étapes (remplace l'ancien score 1-10)
    score: {
      type: DataTypes.ENUM(...JURY_RATING_VALUES),
      allowNull: false,
      comment: "Note qualitative : TRES_BIEN | BIEN | BOF | JAIME_PAS",
    },
    internalComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Commentaire interne (non public) pour délibération",
    },
  },
  {
    tableName: "jury_ratings",
    underscored: true,
    timestamps: true,
    indexes: [
      // Contrainte unique : un juré ne peut avoir qu'un seul vote par film
      // La mise à jour se fait via upsert dans JuryRatingService
      { name: "jury_ratings_film_user_uq", unique: true, fields: ["film_id", "user_id"] },
    ],
  }
);

export default JuryRating;
export { JURY_RATING_VALUES };
