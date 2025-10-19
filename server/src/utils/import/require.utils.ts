/* ==========================================================================
   Utils : require_Utils
   --------------------------------------------------------------------------
   Description :
   Ce module réintroduit la fonction `require()` dans un projet configuré en 
   ESModules (`"type": "module"` dans package.json). 
   En environnement ESM, la fonction native `require()` n’est plus disponible. 
   L’API `createRequire()` du module natif "node:module" permet de recréer une 
   instance locale de `require()` compatible avec le contexte ESM.

   Utilité :
   - Importer des librairies CommonJS (anciennes dépendances qui ne supportent
     pas encore la syntaxe `import`, comme certaines versions de "aedes", 
     "chalk", "bcrypt", etc.).
   - Charger des fichiers JSON ou modules dynamiques au runtime.
   - Assurer la compatibilité descendante entre les modules CommonJS et ESM.

   Attention :
   - Cet utilitaire ne doit être utilisé que pour les dépendances 
     **incompatibles ESM**.
   - Pour tous les modules modernes ou internes au projet, il faut continuer 
     d’utiliser la syntaxe `import`.
   ========================================================================== */

/* Import des dépendances : */
import { createRequire } from "node:module";

const require_Utils = createRequire(import.meta.url);

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
   let optionalPackage;
   try {
       optionalPackage = require_Utils("optional-lib");
   } catch {
       console.warn("⚠️  optional-lib non installé, exécution en mode dégradé.");
   }
   ========================================================================== */
