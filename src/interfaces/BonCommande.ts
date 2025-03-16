import { LigneBonCommande } from "./LigneBonCommande";

export interface BonCommandeDetail {
    bonCommandeId: number;
    reference: string;
    status: string;
    prix: number;
    dateCreation: string;
    fournisseur: {
      fournisseurId: number;
      nom: string;
    };
    ligneBonCommandes: LigneBonCommande[];
}
export interface BonCommande {
    bonCommandeId: number;
    reference: string;
    status: string;
    prix: number;
    dateCreation: string;
    fournisseur: {
      fournisseurId: number;
      nom: string;
    };
    ligneBonCommandes: LigneBonCommande[];
}
