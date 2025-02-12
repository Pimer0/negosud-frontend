/* eslint-disable @typescript-eslint/no-unused-vars */
interface PanierVirtuel {
    [key: number]: {
        quantite: number;
        ligneCommandeId: number;
    };
}
interface PanierItem {
    quantite: number;
    prix: number,
}
interface PanierData {
    ligneCommandes: LigneCommande[];
    commandeId: number;
}