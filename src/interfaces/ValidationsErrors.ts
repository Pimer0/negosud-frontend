export interface ValidationErrors {
    errors?: {
        articleId?: string[];
        quantite?: string[];
        refLot?: string[];
        seuilMinimum?: string[];
        reapprovisionnementAuto?: string[];
        nom?: string[];
        raisonSociale?: string[];
        email?: string[];
        tel?: string[];
        general?: string[];
    };
}