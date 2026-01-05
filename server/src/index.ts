/* Import des Config : */
import "./config/dotenv.config.js";
import { ENV_SAFE } from "./config/ENV.config.js";

/* Import des dépendances : */
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import cron from "node-cron";

/* Import des Routers */
import router from "./router/router.js";

/* Import des Controllers */
import { homeManager_Controller } from "./controller/manager_controller/homeManager.controller.js";
// import { shellyPriseZSF2400ACN1_Controller } from "./controller/shelly_controller/shellyPriseZSF2400ACN1.controller.js";

const app = express();
const port = ENV_SAFE("VITE_PORT_API_SERVER");

app.use(
    cors(
        {
            origin: ENV_SAFE("VITE_DOMAIN_CLIENT"),
            credentials: true,
        }
    )
);

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

/**
 * Route de base
 * Path: /
 * Action callBack
 * Methode: GET
 */
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("API de ExpressPowerFlow !");
});

/* ---------------------------------------------
   CRON 1 Hz + verrou anti-chevauchement
--------------------------------------------- */
// setInterval(shellyPriseZSF2400ACN1_Controller, 1000);
let tickRunning: boolean = false;

async function runHomeManager_Safe(): Promise<void> {
    if (tickRunning) {
        // utile pour diagnostiquer : si tu vois ça souvent, ton tick dépasse 1s
        console.warn(`[CRON] Tick sauté (déjà en cours).`);
        return;
    }

    tickRunning = true;


    try {
        // Ton orchestrateur (fetchs -> mémoire -> home)
        await homeManager_Controller();
    }
    catch (error) {
        console.error(`[CRON] Erreur dans homeManager_Controller :`, error);
    }
    finally {
        tickRunning = false;
    }
}

/**
 * CRON chaque seconde (avec secondes)
 * seconde minute heure jour mois jourSemaine
 */
cron.schedule(
    "*/1 * * * * *",
    async () => {
        await runHomeManager_Safe();
    },
    { timezone: "Europe/Paris" }
);

/**
 * Gestion des routes innexistante
 */
app.use(async (req: Request, res: Response) => {
    res.status(404).json(
        {
            success: false,
            message: "Route non trouvée",
            method: req.method,
            path: req.originalUrl,
        }
    );

    console.error(
        {
            identity: "index.ts",
            type: "Gestionnaire des routes inconnues",
            chemin: "/server/src/index.ts",
            "❌ Nature de l'erreur": "Tentative d'accès à une route inexistante !",
            method: req.method,
            path: req.originalUrl,
            contenu: req.body,
        }
    );
});

/**
 * Le server se lance sur le port défini par VITE_PORT_API_SERVER
 */
app.listen(port, async () => {
    console.info(chalk.cyan(`Server lancé sur ${await ENV_SAFE("VITE_DOMAIN_API_SERVER")}`));
});
