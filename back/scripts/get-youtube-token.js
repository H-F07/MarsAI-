/**
 * Script one-time — obtenir un refresh token YouTube OAuth2
 *
 * Prérequis dans .env :
 *   GOOGLE_CLIENT_ID=...
 *   GOOGLE_CLIENT_SECRET=...
 *
 * Usage :
 *   node scripts/get-youtube-token.js
 */

import "dotenv/config";
import { google } from "googleapis";
import http from "http";
import { URL } from "url";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:9090";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌  GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET manquants dans .env");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
});

console.log("\n🔗  Ouvre cette URL dans ton navigateur :\n");
console.log(authUrl);
console.log("\n⏳  En attente de la redirection sur http://localhost:9090 ...\n");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400);
    res.end("Code manquant");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1 style='font-family:sans-serif'>✅ Token obtenu ! Ferme cette page.</h1>");

    console.log("✅  Refresh token obtenu !\n");
    console.log("Copie cette ligne dans ton .env :\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  } catch (err) {
    res.writeHead(500);
    res.end("Erreur");
    console.error("❌  Erreur :", err.message);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(9090);
