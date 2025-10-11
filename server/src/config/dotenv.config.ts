/* Import des dépendances : */
import chalk from "chalk";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

/* Import des Types : */
import { Environnement_Type } from "../types/config_type/environnement.config.type.js";

/* -- __dirname compatible ESM -- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Détermine le fichier .env à charger
 * NODE_ENV (docker-compose, npm scripts, etc.). Défaut: "development"
 */
const VerifENV = (process.env.NODE_ENV || "development") as Environnement_Type;

/* Chemin vers /server/.env.<env> (depuis /server/src/config) */
const envDevPath: string = path.resolve(__dirname, `../../.env.${VerifENV}`);

if (VerifENV === "development") {
    if (!fs.existsSync(envDevPath)) {
        console.error({
            identity: "dotenv.config.ts",
            type: "fichier de configuration",
            chemin: "/server/src/config/dotenv.config.ts",
            "❌ Nature de l'erreur": `Fichier .env.development introuvable !`,
            route: envDevPath,
        });
        process.exit(1);
    }
    dotenv.config({ path: envDevPath });
    console.info(chalk.magenta(`Environnement .env.${VerifENV} chargé !`));
} else {
    // En prod/test, on laisse l’ENV venir du système (Docker/CI). Optionnel :
    dotenv.config();
}
