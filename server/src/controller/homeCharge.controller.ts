/* Import des Datas */

/* Import des Types : */


async function homeCharge_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des datas nécessaires depuis la mémoire */



        
            /* Cibler le input limite pour vérifier que la commande est correcte
            faire attention a ce que le status est ok pour éviter d'envoyer une commande inutile. 
            implanter une surveillance avec shelly compteur et prise pour brider les batteries et ne pas dépasser les 8700w
            Prendre en compte le % de batterie, c'est a dire brider uniquement la batterie ayant le % le plus élevé */
    }
    catch (error) {
        console.error("Erreur dans le controller homeCharge_Controller :", error);
    }
}

export { homeCharge_Controller };

