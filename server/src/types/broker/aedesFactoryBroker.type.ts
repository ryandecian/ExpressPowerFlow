/* Import des Types : */
import type { AedesLikeBroker_Interface } from "./aedesLikeBroker.interface.js";

type AedesFactoryBroker_Type = (opts?: { concurrency?: number }) => AedesLikeBroker_Interface;

export type { AedesFactoryBroker_Type };

/* -------------------------------------------------------------------------- */
/* 🧩 Documentation : AedesFactoryBroker_Type                                 */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Function} AedesFactoryBroker_Type
 * @description
 * Type représentant la **fonction fabrique (factory)** utilisée pour créer
 * une instance de broker MQTT compatible avec Aedes.
 *
 * Cette fabrique est une **abstraction typée** autour de la fonction `aedes()`
 * exportée par la bibliothèque `aedes`.  
 * Elle permet de :
 * - Créer dynamiquement un broker MQTT en mémoire,  
 * - Définir certaines options de performance (`concurrency`),  
 * - Retourner une instance conforme à `AedesLikeBroker_Interface`,  
 *   ce qui garantit la compatibilité avec ton code métier sans dépendre
 *   directement de la classe interne d’Aedes.
 *
 * ---
 * ### 🧠 Pourquoi ce type existe :
 * TypeScript ne peut pas deviner automatiquement le type de retour de `aedes()`
 * (la lib n’a pas toujours de types explicites pour son instance).
 * Ce type sert donc à **forcer un contrat clair** entre :
 * - la fonction fabrique (`aedes()`)  
 * - et l’interface qui décrit son instance (`AedesLikeBroker_Interface`)
 *
 * ---
 *
 * ### ⚙️ Signature :
 * ```ts
 * type AedesFactoryBroker_Type = (
 *     opts?: { concurrency?: number }
 * ) => AedesLikeBroker_Interface;
 * ```
 *
 * @param {Object} [opts] - Options facultatives de création du broker.
 * @param {number} [opts.concurrency] - Nombre maximum de messages MQTT
 * pouvant être traités simultanément (contrôle la charge et la fluidité).
 *
 * @returns {AedesLikeBroker_Interface}
 * Une instance de broker prête à être utilisée (start, stop, authenticate, etc.).
 *
 * ---
 *
 * ### 📘 Exemple d’utilisation :
 * ```ts
 * import aedes from "aedes";
 * import type { AedesFactoryBroker_Type } from "./types/aedesFactoryBroker.type";
 *
 * const createBroker: AedesFactoryBroker_Type = aedes;
 *
 * const broker = createBroker({ concurrency: 100 });
 * console.log("Clients connectés :", broker.connectedClients);
 * ```
 *
 * ---
 *
 * ### 🔍 Cas d’usage typique :
 * Ce type est utilisé lorsque tu veux :
 * - Instancier ton broker avec des **valeurs configurables**,  
 * - **Mocker** ou **remplacer** la factory Aedes dans tes tests (ex: `fakeAedes()`),  
 * - Documenter explicitement le contrat entre ta fonction `aedes()` et ton code.
 *
 * ---
 *
 * ### 🧱 Schéma conceptuel :
 * ```
 * +---------------------------+
 * | AedesFactoryBroker_Type   |  ←  Fonction fabrique (ex: aedes)
 * +---------------------------+
 *              |
 *              v
 * +---------------------------+
 * | AedesLikeBroker_Interface |  ←  Instance du broker créée (objet)
 * +---------------------------+
 * ```
 */
