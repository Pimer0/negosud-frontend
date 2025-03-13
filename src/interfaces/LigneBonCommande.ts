export interface LigneBonCommande {
    ligneBonCommandeId: number;
    articleId: number;
    article: Article;
    quantite: number;
    prixUnitaire: number;
    livree: boolean;
}