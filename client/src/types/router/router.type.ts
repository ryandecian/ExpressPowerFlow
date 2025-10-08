/* Import des Types */
import type { ReactNode } from "react";

type Router_Type = {
    path: string;               // optionnel si route index
    element?: ReactNode;         // texte, JSX, fragments… tout passe
    children?: Router_Type[];    // routes enfants
};

export type { Router_Type };
