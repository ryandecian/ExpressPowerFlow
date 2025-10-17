/* Import des Types : */
import type { Client as AedesClient, Subscription } from "aedes";
import type { IPublishPacket } from "mqtt-packet";

interface AedesLikeBroker_Interface {
    connectedClients: number;
    handle: (socket: import("node:net").Socket) => void;
    close: (cb: () => void) => void;

    authenticate: (
        client: AedesClient,
        username: string | null | undefined,
        password: Buffer | null | undefined,
        done: (err: Error | null, success: boolean) => void
    ) => void;

    authorizePublish: (
        client: AedesClient,
        packet: IPublishPacket,
        done: (error?: Error) => void
    ) => void;

    authorizeSubscribe: (
        client: AedesClient,
        sub: Subscription,
        done: (error: Error | null, subscription?: Subscription | null) => void
    ) => void;

    on: (event: "client" | "clientDisconnect", listener: (c: AedesClient) => void) => void;
}

export type { AedesLikeBroker_Interface };

/* -------------------------------------------------------------------------- */
/* 🧩 Documentation : AedesLikeBroker_Interface                               */
/* -------------------------------------------------------------------------- */

/**
 * @interface AedesLikeBroker_Interface
 * @description
 * Interface TypeScript définissant la **forme contractuelle minimale** d’un
 * **broker MQTT compatible Aedes**, utilisée dans ExpressPowerFlow pour typer
 * les interactions internes (authentification, ACL, gestion des connexions, etc.).
 *
 * Cette interface permet de décrire un objet **fonctionnellement équivalent**
 * à une instance Aedes, sans imposer la dépendance directe à la classe réelle.
 * Elle est donc utile pour :
 * - Les **mocks** ou **tests unitaires** (simuler un broker sans réseau),
 * - L’**isolation typée** entre ton code métier et la lib Aedes,
 * - Une **interopérabilité** future si tu remplaces Aedes par un autre broker.
 *
 * ---
 * ### ⚙️ Principaux rôles du broker :
 * - Gérer les **clients connectés** (comptage, connexions/déconnexions),
 * - Authentifier les utilisateurs via la méthode `authenticate()`,
 * - Contrôler les autorisations de publication et d’abonnement (`authorizePublish`, `authorizeSubscribe`),
 * - Écouter des événements (`on("client")`, `on("clientDisconnect")`),
 * - Fournir un handler réseau (`handle`) pour accepter des sockets TCP.
 * ---
 *
 * ### 🔒 Notes de sécurité :
 * Ces hooks (`authenticate`, `authorizePublish`, `authorizeSubscribe`) sont
 * exécutés à chaque connexion ou message MQTT. Ils doivent toujours être :
 * - **synchrones dans la logique**, même s’ils utilisent un callback `done()`,
 * - **robustes aux erreurs**, pour ne pas bloquer le broker.
 *
 * ---
 *
 * @property {number} connectedClients
 * Nombre de clients MQTT actuellement connectés au broker.
 *
 * @property {(socket: import("node:net").Socket) => void} handle
 * Handler à passer au serveur TCP (`net.createServer`) pour déléguer la
 * gestion du protocole MQTT à Aedes.
 *
 * @property {(cb: () => void) => void} close
 * Ferme proprement le broker et libère les ressources.
 *
 * @property {(client: AedesClient, username: string|null|undefined, password: Buffer|null|undefined, done: (err: Error|null, success: boolean) => void) => void} authenticate
 * Méthode appelée à chaque tentative de connexion d’un client MQTT.
 * Doit appeler `done(null, true)` pour autoriser, ou `done(null, false)` pour refuser.
 *
 * @property {(client: AedesClient, packet: IPublishPacket, done: (error?: Error) => void) => void} authorizePublish
 * Hook exécuté lors d’une tentative de **publication** d’un message MQTT.
 * Permet de refuser (`done(new Error("Refusé"))`) ou d’autoriser (`done(null)`).
 *
 * @property {(client: AedesClient, sub: Subscription, done: (error: Error|null, subscription?: Subscription|null) => void) => void} authorizeSubscribe
 * Hook exécuté lors d’une tentative d’**abonnement** à un topic MQTT.
 * Si l’abonnement est refusé, appeler `done(null, null)` ; sinon `done(null, sub)`.
 *
 * @property {(event: "client" | "clientDisconnect", listener: (c: AedesClient) => void) => void} on
 * Événement interne déclenché à chaque **connexion** ou **déconnexion** de client MQTT.
 * Exemple :
 * ```ts
 * broker.on("client", c => console.log("Client connecté:", c.id));
 * broker.on("clientDisconnect", c => console.log("Client déconnecté:", c.id));
 * ```
 *
 * ---
 * ### 📘 Exemple d’utilisation typée :
 * ```ts
 * import type { AedesLikeBroker_Interface } from "./types/mqtt.types";
 *
 * function logStatus(broker: AedesLikeBroker_Interface) {
 *     console.log("Clients connectés :", broker.connectedClients);
 * }
 * ```
 */
