import instance from "./config.js";

/**
 * Récupère les films en sélection officielle (route publique)
 * Retourne un tableau de films avec User inclus
 */
export const fetchSelectionOfficielle = () =>
  instance.get("/films/selection-officielle");
