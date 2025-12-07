/* Cette fonction reçois un nombre négatif donc décharge de la batterie */
function adjustZendureDischargePower(targetDischarge) {
    let commande = (targetDischarge * 0.975) + 21;
    /* Si la valeur est négative, on la change en positif */
    if (commande < 0) {
        commande = Math.abs(commande);
    }
    /* Limite la commande a la puissance maximale de décharge de la batterie */
    if (commande > 2400) {
        commande = 2400;
    }
    /* Arrondi la au nombre entier le plus proche */
    commande = Math.round(commande);
    /* Retourne la commande ajustée tjs positive */
    return commande;
}
export { adjustZendureDischargePower };
