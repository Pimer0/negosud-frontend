import {ReactNode} from "react";

export interface ProduitProps {
   articleId: number;
   reference: string;
   libelle: string;
   famille: famille;
   prix: number;
children: ReactNode;
}

export interface famille {
   familleId: number;
   nom: string;
}