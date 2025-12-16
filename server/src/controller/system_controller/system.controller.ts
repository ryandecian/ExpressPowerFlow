/* Import des Datas */
import { getSystemOverview_Memory } from "../../database/data_memory/systemOverview.data.memory.js";

/* Import des dépendances externes : */
import { Request, Response } from "express";

async function system_Controller(req: Request, res: Response): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données système */
            const systemOverview = getSystemOverview_Memory();
        
        /* Logique métier 2 : Vérification des données système */
            if (!systemOverview) {
                res.status(500).json({ error: "Erreur : Les données système ne sont pas disponibles." });
                return;
            }
            
        /* Logique métier 3 : Envoi des données système */
            res.status(200).json({
                message: "Données système récupérées avec succès.",
                data: "test validé",
            });
            return;
    }
    catch (error) {
        console.error("Une erreur inconnue est survenue dans system_Controller :", error);
    }
}

export { system_Controller };
