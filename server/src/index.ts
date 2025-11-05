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

import { shellyPower_Controller } from "./controller/shelly_controller/shellyPower.controller.js";
import { shellyPriseZSF2400ACN1_Controller } from "./controller/shelly_controller/shellyPriseZSF2400ACN1.controller.js";
import { shellyPriseZSF2400ACN2_Controller } from "./controller/shelly_controller/shellyPriseZSF2400ACN2.controller.js";
import { zendureSolarflow2400ACN1_Controller } from "./controller/zendure_controller/zendureSolarflow2400ACN1.controller.js";
import { home_Controller } from "./controller/home.controller.js";

const app = express();
const port = ENV_SAFE("VITE_PORT_API_SERVER");

app.use(cors(
    {
        origin: ENV_SAFE("VITE_DOMAIN_CLIENT"),
        credentials: true,
    }
));

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
})

/* Appel de controller automatique */
    /* Compteur Shelly 3EM */
        setInterval(shellyPower_Controller, 1000);
    /* Prise Shelly Plug s Gen 3 raccordée aux batteries Zendure */
        setInterval(shellyPriseZSF2400ACN1_Controller, 1000);
        setInterval(shellyPriseZSF2400ACN2_Controller, 1000);
    /* Batterie Zendure Solarflow 2400AC */
        setInterval(zendureSolarflow2400ACN1_Controller, 1000);
    /* Logique métier centrale */
        cron.schedule(
            "*/1 * 0-14,17-23 * * *",
            home_Controller,
            { timezone: "Europe/Paris" }
        );

/**
 * Gestion des routes innexistante
 */
app.use( async (req: Request, res: Response) => {
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
            contenu : req.body
        },
    );
});

/**
 * Le server se lance sur le port 8080
 */
app.listen(port, async () => {
    console.info(chalk.cyan(`Server lancé sur ${ await ENV_SAFE("VITE_DOMAIN_API_SERVER")}`));
});
