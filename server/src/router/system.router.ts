/* Import des dépendances : */
import { Router } from "express";

/* Import des Controllers */
import { system_Controller } from "../controller/system_controller/system.controller.js";

/* Import des Middlewares */

const system_Router = Router();

/* Route 1 */
/* System : Visualisation de l'état globale du système */
/* URI : /system */
system_Router.get("/",
    system_Controller
);

export { system_Router };
