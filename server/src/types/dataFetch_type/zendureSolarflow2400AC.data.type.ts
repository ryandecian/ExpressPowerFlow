type ZendureSolarflow2400AC_data_Type = {
    timestamp: number, /* ⚠️ Horodatage UNIX du message (en secondes) */
    messageId: number, /* Identifiant du message envoyé (incrémental) */
    sn: string, /* ⚠️ Numéro de série de l’appareil principal (onduleur SolarFlow 2400 AC) */
    version: number, /* Version du protocole ou firmware de communication */
    product: string, /* ⚠️ Nom du modèle de l’appareil Zendure */
    properties: {
        heatState: number, /* État thermique global (0 = normal, 1 = surchauffe) */
        packInputPower: number, /* Puissance entrant dans la batterie (W) → charge */
        outputPackPower: number, /* Puissance sortant de la batterie (W) → décharge */
        outputHomePower: number, /* Puissance fournie à la maison (W) */
        remainOutTime: number, /* Temps restant estimé de charge/décharge (secondes) */
        packState: number, /* État du pack batterie (2 = en charge, 3 = en décharge, etc.) */
        electricLevel: number, /* Niveau de charge batterie (en %) */
        gridInputPower: number, /* Puissance tirée du réseau (W) */
        solarInputPower: number, /* Puissance totale provenant des panneaux solaires (W) */
        solarPower1: number, /* Puissance du panneau solaire 1 (W) */
        solarPower2: number, /* Puissance du panneau solaire 2 (W) */
        solarPower3: number, /* Puissance du panneau solaire 3 (W) */
        solarPower4: number, /* Puissance du panneau solaire 4 (W) */
        solarPower5: number, /* Puissance du panneau solaire 5 (W) */
        solarPower6: number, /* Puissance du panneau solaire 6 (W) */
        pass: number, /* Indicateur de transfert direct solaire → maison (0 = non) */
        reverseState: number, /* État d’injection vers le réseau (0 = désactivé) */
        socStatus: number, /* État du calcul de SoC (0 = valide) */
        hyperTmp: number, /* ⚠️ Température interne brute (3071 = 30,71°C) */
        gridOffPower: number, /* Puissance fournie en mode hors-réseau (W) */
        dcStatus: number, /* Statut du circuit DC (1 = actif) */
        pvStatus: number, /* Statut de la production PV (0 = inactif) */
        acStatus: number, /* Statut du module AC (1 = en marche) */
        dataReady: number, /* Données prêtes à être lues (1 = oui) */
        gridState: number, /* ⚠️ État du réseau détecté (1 = présent) */
        BatVolt: number, /* ⚠️ Tension batterie (mV → 4971 ≈ 49,71V) */
        socLimit: number, /* Limite supérieure de SoC paramétrée (0 = aucune) */
        writeRsp: number, /* Réponse à une commande d’écriture (0 = aucune) */
        acMode: number, /* ⚠️ Mode AC: 0 = veille/idle, 1 = charge, 2 = décharge */
        inputLimit: number, /* ⚠️ Limite de puissance d’entrée configurée (W ou %) */
        outputLimit: number, /* ⚠️ Limite de puissance de sortie configurée vers maison (W) */
        socSet: number, /* ⚠️ SoC cible paramétré (1000 ≈ 100%) */
        minSoc: number, /* ⚠️ Seuil minimum avant arrêt de décharge (50 ≈ 5%) */
        gridStandard: number, /* Type de réseau (1 = standard européen) */
        gridReverse: number, /* Sens de l’alimentation réseau (2 = sortie interdite) */
        inverseMaxPower: number, /* Puissance maximale d’injection (W) */
        lampSwitch: number, /* État du voyant/éclairage (1 = allumé) */
        gridOffMode: number, /* Mode hors-réseau actif (2 = activé) */
        IOTState: number, /* État de la connexion IoT (2 = connecté) */
        fanSwitch: number, /* Autorisation du ventilateur (1 = activé) */
        fanSpeed: number, /* Vitesse du ventilateur (0 = arrêté) */
        bindstate: number, /* Appareil lié à un compte (0 = non lié) */
        VoltWakeup: number, /* Seuil de réveil de la batterie (non utilisé) */
        OldMode: number, /* Ancien mode d’exploitation (0 = désactivé) */
        OTAState: number, /* État de mise à jour firmware (0 = aucune) */
        LCNState: number, /* État de la communication locale (0 = OK) */
        factoryModeState: number, /* Mode usine (0 = désactivé) */
        ts: number, /* Horodatage interne secondaire */
        tsZone: number, /* Zone horaire ou identifiant interne */
        smartMode: number, /* Mode intelligent (1 = activé) */
        chargeMaxLimit: number, /* Limite maximale de charge (W) */
        phaseSwitch: number, /* Sélecteur monophasé (1 = activé) */
        packNum: number, /* Nombre de batteries connectées */
        rssi: number, /* Intensité du signal Wi-Fi (dBm) */
        is_error: number, /* Code d’erreur global (0 = aucun) */
    },
    packData: {
        sn: string, /* Numéro de série du pack batterie */
        packType: number, /* Type du pack (5 = AB300X) */
        socLevel: number, /* Niveau de charge batterie (%) */
        state: number, /* État de la batterie (2 = en charge, 3 = décharge) */
        power: number, /* Puissance nette actuelle de la batterie (W) */
        maxTemp: number, /* Température max des cellules (~30,8°C si /100) */
        totalVol: number, /* Tension totale du pack (mV → 4970 ≈ 49,7V) */
        batcur: number, /* Courant de charge brut (peut être signé, ex: 65493 ≈ -43A) */
        maxVol: number, /* Tension cellule la plus haute (3,32V) */
        minVol: number, /* Tension cellule la plus basse (3,31V) */
        softVersion: number, /* Version logicielle du BMS */
        heatState: number /* État thermique du pack (0 = normal) */
    }[]
}

export { ZendureSolarflow2400AC_data_Type }
