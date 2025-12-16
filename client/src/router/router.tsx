/* Import des Types */
import type { Router_Type } from "../types/router/router.type";

/* Liste des pages en import */
/* Page Frontend verrouillée */
import System_Page from "../pages/private/system_Page/System.page";

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
    /* Exemple d’accès à la première route : {router[1].path} */
    {
        path: "/system",
        element: <System_Page />,
    },
];

export default router;
