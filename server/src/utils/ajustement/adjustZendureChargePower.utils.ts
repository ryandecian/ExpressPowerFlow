/* Cette fonction reçois un nombre positif = charge batterie */
function adjustZendureChargePower(targetCharge: number): number {
    let commande = (targetCharge * 0.966) + 22;

    /* Si la valeur est négative, on la change en positif */
    if (commande < 0) {
        commande = Math.abs(commande);
    }

    /* Limite la commande a la puissance maximale de charge de la batterie */
    if (commande > 2400) {
        commande = 2400;
    }

    /* Arrondi la au nombre entier le plus proche */
    commande = Math.round(commande);

    /* Retourne la commande ajustée tjs positive */
    return commande;
}

export { adjustZendureChargePower };
