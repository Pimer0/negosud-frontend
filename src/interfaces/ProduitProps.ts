import {ReactNode} from "react";
import { Famille } from "./Famille";

export interface ProduitProps {
   articleId: number;
   reference: string;
   libelle: string;
   famille: Famille;
   prix: number;
children: ReactNode;
}

export interface famille {
   familleId: number;
   nom: string;
}