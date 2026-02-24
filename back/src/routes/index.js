/**
 * @bref Routes principales - Point d'entrée de toutes les routes API
 */

import express from "express";
import userRouter from "./User.route.js";
import videoRouter from "./Video.route.js";
import filmRouter from "./Film.route.js";
import authRouter from "./Auth.route.js";
import juryRatingRouter from "./JuryRating.route.js";

const router = express.Router();

/**
 * @bref Routes
 */
router.use("/auth", authRouter);
router.use("/users", userRouter);
/**
 * @bref Legacy (à migrer vers /films)
 */
router.use("/videos", videoRouter);
router.use("/films", filmRouter);
/**
 * @bref Votes du jury (JURY → soumettre/modifier, ADMIN → délibération)
 */
router.use("/jury-ratings", juryRatingRouter);

/**
 * @bref Route de santé (health check)
 */
router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API marsAI opérationnelle" });
});

export default router;
