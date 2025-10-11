import { Router } from "express";

/* Import des routers secondaires */

/* Import des Controllers */

/* Import des Middlewares */
// import RouteLimiterRequestIP from "../security/middlewareSecurity/RouteLimiterRequestIP";
// import VerifyKeys from "../middleware/VerifyKeys/VerifyKeys";

const router = Router();


/* Redirection vers un router secondaire */

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
