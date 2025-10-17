/* Import des Types : */
import type { AedesFactoryBroker_Type } from "./aedesFactoryBroker.type.js";

type AedesInstanceBroker_Type = ReturnType<AedesFactoryBroker_Type>;

export type { AedesInstanceBroker_Type };

/* -------------------------------------------------------------------------- */
/* 🧩 Documentation : AedesInstanceBroker_Type                                */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {object} AedesInstanceBroker_Type
 * @description
 * Type représentant **l’instance de broker MQTT** réellement créée
 * par la fonction fabrique `AedesFactoryBroker_Type`.
 *
 * En d’autres termes :
 * - `AedesFactoryBroker_Type` → décrit **la fonction qui fabrique** un broker,  
 * - `AedesInstanceBroker_Type` → décrit **l’objet broker résultant**.
 *
 * Ce type est obtenu via `ReturnType<AedesFactoryBroker_Type>`, ce qui signifie :
 * > “Prends le type de ce que retourne la factory et utilise-le comme référence.”
 *
 * ---
 * ### ⚙️ Objectif :
 * Fournir un alias typé clair pour toutes les variables qui **contiennent un broker actif**,
 * afin d’éviter de répéter le type long et de renforcer la lisibilité dans ton code.
 *
 * Il correspond directement à une instance conforme à
 * [`AedesLikeBroker_Interface`](./aedesLikeBroker.interface.js).
 *
 * ---
 *
 * ### 🧩 Relation entre les trois types :
 * ```
 * +----------------------------+
 * | AedesFactoryBroker_Type    | ← Fonction fabrique (ex: aedes)
 * +-------------+--------------+
 *               |
 *     ReturnType<...>
 *               |
 *               v
 * +----------------------------+
 * | AedesInstanceBroker_Type   | ← Objet broker instancié
 * +-------------+--------------+
 *               |
 *               v
 * +----------------------------+
 * | AedesLikeBroker_Interface  | ← Structure minimale commune
 * +----------------------------+
 * ```
 *
 * ---
 *
 * ### 💡 Exemple d’utilisation :
 * ```ts
 * import aedes from "aedes";
 * import type { AedesInstanceBroker_Type } from "./types/aedesInstanceBroker.type";
 *
 * // Création du broker avec la factory Aedes
 * const broker: AedesInstanceBroker_Type = aedes({ concurrency: 100 });
 *
 * console.log("Clients connectés :", broker.connectedClients);
 * broker.on("client", (c) => console.log("Client connecté :", c.id));
 * ```
 *
 * ---
 *
 * ### 🧠 Pourquoi utiliser `ReturnType` ici ?
 * `ReturnType` est un utilitaire TypeScript natif qui extrait automatiquement le type
 * de retour d’une fonction.  
 * Cela garantit que si la **factory Aedes** change sa signature, le type
 * `AedesInstanceBroker_Type` sera **mis à jour automatiquement**, sans besoin de le modifier à la main.
 *
 * ---
 *
 * @see {@link AedesFactoryBroker_Type} – Type de la fonction qui crée le broker.
 * @see {@link AedesLikeBroker_Interface} – Interface décrivant la structure de l’instance.
 */
