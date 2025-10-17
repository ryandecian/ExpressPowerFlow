import type { Client as AedesClient } from "aedes";

type AugmentedClientBroker_Type = AedesClient & {
    __username?: string;
};

export type { AugmentedClientBroker_Type };

/**
 * Type utilitaire permettant d’étendre le type natif `AedesClient` fourni par la librairie Aedes.
 *
 * Objectif :
 * ----------
 * Dans le protocole MQTT, Aedes ne conserve pas directement le nom d’utilisateur (`username`)
 * ayant été authentifié lors de la connexion du client. Or, pour appliquer les règles ACL
 * (autorisations de publication et d’abonnement), le broker a besoin d’accéder à cette information.
 *
 * Ce type "augmenté" permet donc de stocker le nom d’utilisateur validé dans la propriété interne
 * `__username` de chaque client connecté, sans avoir recours au type `any` ni à une mutation globale.
 *
 * Détails :
 * ---------
 * - `AedesClient` : type d’origine, représentant un client MQTT géré par Aedes.
 * - `__username` : propriété optionnelle ajoutée dynamiquement après authentification réussie.
 *   Elle contient la chaîne d’identification de l’utilisateur.
 *
 * Exemple d’utilisation :
 * -----------------------
 * ```ts
 * // Après authentification réussie :
 * (client as AugmentedClient).__username = username;
 *
 * // Lors de la vérification ACL :
 * const username = (client as AugmentedClient).__username;
 * ```
 *
 * Sécurité :
 * ----------
 * Le double underscore (`__`) en préfixe souligne que cette propriété est interne au broker,
 * et qu’elle ne doit pas être exposée ni utilisée directement par des clients externes.
 */
