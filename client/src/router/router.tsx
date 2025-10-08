/* Import des Types */
import type { Router_Type } from "../types/router/router.type";

/* Liste des pages en import */
/* Page Frontend verrouillée */

/* Page Frontend public */

/**
 * Utilisation :
 * {router[0].path}
 */

const router: Router_Type[] = [
    /* Exemple d’accès à la première route : {router[0].path} */
    {
        path: "/",
        element: <h1>Accueil ExpressPowerFlow sous React</h1>,
    },
];

export default router;
