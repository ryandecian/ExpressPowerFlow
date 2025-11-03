function adjustZendureChargePower(targetCharge: number): number {
    let commande = (targetCharge + 22.5) / 1.03;

    /* Limite la commande a la puissance maximale de charge de la batterie */
    if (commande > 2400) {
        commande = 2400;
    }

    /* Arrondi la au nombre entier le plus proche */
    commande = Math.round(commande);

    return commande;
}

export { adjustZendureChargePower };
