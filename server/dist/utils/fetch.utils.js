async function fetch_Utils(methode, url, body) {
    let error = null;
    let data = null;
    /* Vérification si le body est présent ou vide pour éviter l'envois d'un body vide */
    let checkBody = false;
    if (body && Object.keys(body).length > 0 && methode !== "GET") {
        checkBody = true;
    }
    try {
        /* Logique 1 : Envois de la requête */
        const response = await fetch(url, {
            /* Option 1 : */
            method: methode,
            /* Option 2 : */
            ...(checkBody === true && {
                /* Envois un headers uniquement si un body est présent */
                headers: {
                    "Content-Type": "application/json",
                }
            }),
            /* Option 3 : */
            ...(checkBody === true && {
                /* Envois un body uniquement si un body est présent */
                body: JSON.stringify(body)
            })
        });
        /* Logique 2 : Récupération des données */
        /* Etape 1 : */
        /* On vérifie si le serveur renvois un type de contenu JSON */
        /* Cela évite un plantage si ce n'est pas le cas */
        const contentType = response.headers.get("Content-Type") || "";
        /* Etape 2 : */
        /* Si c'est du application/json on le récupère son contenu */
        if (contentType.includes("application/json")) {
            data = await response.json();
        }
        else {
            /* On tente de récupérer le contenu brut sous forme de texte */
            const rawText = await response.text();
            try {
                /* On tente de parser quand même (cas JSON mal formé ou content-type incorrect) */
                data = JSON.parse(rawText);
            }
            catch {
                /* Sinon on le stocke tel quel dans une clé raw */
                data = { raw: rawText };
            }
        }
        /* Logique 3 : Gestion des erreurs */
        if (!response.ok) {
            throw new Error((data && typeof data === "object" && "message" in data) ?
                String(data.message)
                :
                    `Erreur HTTP ${response.status}`);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            error = err.message;
        }
        else {
            error = "Une erreur inconnue s'est produite";
        }
    }
    return ({ error, data });
}
export { fetch_Utils };
