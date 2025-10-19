/* ==========================================================================
   Utils : require_Utils
   --------------------------------------------------------------------------
   Description :
   Ce module réintroduit la fonction `require()` dans un projet configuré en 
   ESModules (`"type": "module"` dans package.json). 
   En environnement ESM, la fonction native `require()` n’est plus disponible. 
   L’API `createRequire()` du module natif "node:module" permet de recréer une 
   instance locale de `require()` compatible avec le contexte ESM.

   Cette version améliorée inclut une gestion d’erreur interne pour éviter un 
   crash du serveur lorsque le module demandé est introuvable. En cas d’échec, 
   un message d’avertissement est affiché et la fonction retourne `null`.

   Utilité :
   - Importer des librairies CommonJS (anciennes dépendances qui ne supportent
     pas encore la syntaxe `import`, comme certaines versions de "aedes", 
     "chalk", "bcrypt", etc.).
   - Charger des fichiers JSON ou modules dynamiques au runtime.
   - Éviter les plantages dus à des dépendances manquantes.

   Attention :
   - Cet utilitaire ne doit être utilisé que pour les dépendances 
     **incompatibles ESM**.
   - Pour tous les modules modernes ou internes au projet, il faut continuer 
     d’utiliser la syntaxe `import`.
   ========================================================================== */

/* Import des dépendances : */
import { createRequire } from "node:module";

const _require = createRequire(import.meta.url);

/**
 * Fonction utilitaire encapsulant `require()` avec gestion d’erreur sécurisée.
 * @param modulePath - Chemin ou nom du module à importer.
 * @returns L’export du module si trouvé, sinon `null`.
 */
function require_Utils(modulePath: string): unknown {
    try {
        return _require(modulePath);
    } catch (error) {
        console.warn(
            `⚠️  Impossible de charger le module "${modulePath}".\n` +
            `Détails : ${(error as Error).message}\n` +
            `Le serveur continue sans ce module.`
        );
        return null;
    }
}

export { require_Utils };

/* ==========================================================================
   Exemple d’utilisation :
   --------------------------------------------------------------------------
   // Exemple 1 : Importer un module CommonJS (comme "aedes")
   import { require_Utils } from "../utils/require.utils.js";
   const aedes = require_Utils("aedes");

   // Exemple 2 : Charger un fichier JSON local
   import { require_Utils } from "../utils/require.utils.js";
   const config = require_Utils("../config/mqttConfig.json");

   // Exemple 3 : Charger dynamiquement une dépendance optionnelle
   import { require_Utils } from "../utils/require.utils.js";
   const optionalLib = require_Utils("optional-lib");
   if (!optionalLib) {
       console.log("Module optionnel absent, exécution en mode dégradé.");
   }
   ========================================================================== */
