export interface ProduitData {
    articleId: number;
    reference: string;
    libelle: string;
    famille: { nom: string | null };
    prix: number;
    quantite?: number;
    commandId?: number | null;
    ligneCommandeId?: number | null;
}