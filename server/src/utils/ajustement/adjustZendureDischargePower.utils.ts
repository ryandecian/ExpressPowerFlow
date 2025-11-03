function adjustZendureDischargePower(targetDischarge: number): number {
    let commande = (targetDischarge - 22.7) / 1.03;

    /* Limite la commande a la puissance maximale de décharge de la batterie */
    if (commande > 2400) {
        commande = 2400;
    }

    /* Arrondi la au nombre entier le plus proche */
    commande = Math.round(commande);

    return commande;
}

export { adjustZendureDischargePower };
