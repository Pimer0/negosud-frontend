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

export interface ValidationErrorsUtilisateurs {
    errors?: {
        motDePasse?: string[];
        prenom?: string[];
        nom?: string[];
        email?: string[];
        tel?: string[];
        roleId?: string[];
        role?: string[];
        general?: string[];
    };
}