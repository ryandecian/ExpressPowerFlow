function adjustZendureDischargePower(targetCharge: number): number {
    const commande = (targetCharge + 22.5) / 1.03;

    return commande;
}

export { adjustZendureDischargePower };
