import { Router } from "express";
/* Import des routers secondaires */
import { user_Router } from "./user.router.js";
/* Import des Controllers */
/* Import des Middlewares */
// import RouteLimiterRequestIP from "../security/middlewareSecurity/RouteLimiterRequestIP";
// import VerifyKeys from "../middleware/VerifyKeys/VerifyKeys";
const router = Router();
/* Redirection vers un router secondaire */
router.use("/user", user_Router); /* 1 routes fonctionnelles */
/* Redirection directe vers un controller */
/* Login : Connexion de l'utilisateur */
/* URI : /login */
// router.post("/login", RouteLimiterRequestIP, VerifyKeys(["email", "password"]),
//     login_controller
// );
/* Déconnexion : Déconnexion de l'utilisateur */
/* URI : /logout */
// router.post("/logout",
//     logout_controller
// );
export default router;
