/**
 * @bref Seeds de films - Films de test avec différents statuts
 * Crée des films de test avec différents statuts (APPROVED, PENDING, SELECTION_OFFICIELLE, etc.)
 * Nécessite que seeds.js soit exécuté au préalable pour créer les réalisateurs
 */

import "dotenv/config";
import sequelize from "../db/connection.js";
import "../models/index.js";
import { Film, User } from "../models/index.js";

/**
 * @bref Fonction principale de seeding des films
 * @returns {Promise<void>}
 */
async function seedFilms() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion BDD OK");

    // Récupérer les réalisateurs
    const realisateurs = await User.findAll({ where: { role: "REALISATEUR" } });
    if (realisateurs.length === 0) {
      console.error("❌ Aucun réalisateur trouvé. Lancez seeds.js d'abord !");
      process.exit(1);
    }

    console.log(`📽️  ${realisateurs.length} réalisateurs trouvés`);

    /**
     * @bref Création des films de test
     * Crée 6 films avec différents statuts et pays pour tester le workflow complet
     */
    const films = await Film.bulkCreate([
      {
        title: "L'IA et le Cinéma",
        description: "Un court métrage explorant les possibilités de l'IA dans le cinéma. Une réflexion sur l'avenir de la création audiovisuelle.",
        duration: 45,
        youtubeId: "dQw4w9WgXcQ", // Exemple YouTube ID (11 caractères)
        country: "FR",
        status: "APPROVED",
        userId: realisateurs[0].id,
        aiIdentity: {
          scenario: "ChatGPT",
          image: "Midjourney",
          video: "Runway ML",
          sound: "ElevenLabs",
          postProduction: "Adobe Premiere",
        },
      },
      {
        title: "Rêves Numériques",
        description: "Une exploration visuelle des rêves générés par IA. Un voyage onirique à travers l'imagination artificielle.",
        duration: 30,
        youtubeId: "jNQXAC9IVRw", // Exemple YouTube ID
        country: "BE",
        status: "PENDING",
        userId: realisateurs[1]?.id || realisateurs[0].id,
        aiIdentity: {
          scenario: "Claude AI",
          image: "DALL-E",
          video: "Pika Labs",
          sound: null,
          postProduction: "DaVinci Resolve",
        },
      },
      {
        title: "Futur Proche",
        description: "Une vision du futur créée entièrement par IA. Comment la technologie transforme notre perception du temps.",
        duration: 60,
        youtubeId: "9bZkp7q19f0", // Exemple YouTube ID
        country: "FR",
        status: "SELECTION_OFFICIELLE",
        userId: realisateurs[0].id,
        aiIdentity: {
          scenario: "GPT-4",
          image: "Stable Diffusion",
          video: "Synthesia",
          sound: "Mubert",
          postProduction: "Final Cut Pro",
        },
      },
      {
        title: "Film Rejeté",
        description: "Ce film a été rejeté pour test de la fonctionnalité de modération.",
        duration: 20,
        youtubeId: "kJQP7kiw5Fk", // Exemple YouTube ID
        country: "FR",
        status: "REJECTED",
        rejectionReason: "Le contenu ne respecte pas les critères de qualité requis. Durée insuffisante et qualité technique en dessous des standards.",
        userId: realisateurs[0].id,
        aiIdentity: {
          scenario: null,
          image: null,
          video: null,
          sound: null,
          postProduction: null,
        },
      },
      {
        title: "L'Éveil de l'IA",
        description: "Un court métrage sur la conscience artificielle et ses implications éthiques.",
        duration: 50,
        youtubeId: "YQHsXMglC9A", // Exemple YouTube ID
        country: "CH",
        status: "APPROVED",
        userId: realisateurs[2]?.id || realisateurs[0].id,
        aiIdentity: {
          scenario: "Anthropic Claude",
          image: "Midjourney v6",
          video: "Runway Gen-2",
          sound: "ElevenLabs",
          postProduction: "Adobe After Effects",
        },
      },
      {
        title: "Hors Compétition",
        description: "Un film présenté hors compétition pour démonstration.",
        duration: 35,
        youtubeId: "fJ9rUzIMcZQ", // Exemple YouTube ID
        country: "BE",
        status: "HORS_COMPETITION",
        userId: realisateurs[1]?.id || realisateurs[0].id,
        aiIdentity: {
          scenario: "ChatGPT-4",
          image: "DALL-E 3",
          video: "Pika 1.5",
          sound: "ElevenLabs",
          postProduction: "Premiere Pro",
        },
      },
    ], { ignoreDuplicates: true });

    console.log(`✅ ${films.length} films créés`);
    
    /**
     * @bref Affichage des statistiques par statut
     * Compte et affiche le nombre de films pour chaque statut
     */
    const stats = await Film.findAll({
      attributes: ["status"],
      group: ["status"],
      raw: true,
    });
    
    console.log("\n📊 Répartition par statut:");
    for (const stat of stats) {
      const count = await Film.count({ where: { status: stat.status } });
      console.log(`   ${stat.status}: ${count}`);
    }

    console.log("\n🎉 Seeds de films terminés !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seedFilms();
