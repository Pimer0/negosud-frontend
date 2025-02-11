import { Famille } from './Famille';

export interface ProduitData {
    articleId: number;
    reference: string;
    libelle: string;
    famille: Famille;
    prix: number;
    quantite?: number;
    commandId?: number | null;
    ligneCommandeId?: number | null;
}