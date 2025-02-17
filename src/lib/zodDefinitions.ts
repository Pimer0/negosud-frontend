import { z } from 'zod';

export const RegisterFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Saisir un mail valide' })
        .trim(),
    mdp: z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial, et faire au moins 8 caractères.'
        })
        .trim(),
    nom: z
        .string()
        .regex(/^[A-Z][a-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Z][a-zÀ-ÖØ-öø-ÿ]+)*$/, {
            message: 'Pas de majuscule, caractères spéciaux ou chiffres'
        })
        .trim(),
    prenom: z
        .string()
        .regex(/^[A-Z][a-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Z][a-zÀ-ÖØ-öø-ÿ]+)*$/, {
            message: 'Pas de majuscule, caractères spéciaux ou chiffres'
        })
        .trim(),
    tel: z
        .string()
        .regex(/^0[1-9]([ .-]?\d{2}){4}$/, {
            message: 'Rentrez un numéro de téléphone français valide'
        })
});

export type FormState =
    | {
    errors?: {
        nom?: string[];
        prenom?: string[];
        email?: string[];
        mdp?: string[];
        tel?: string[];
    };
    message?: string;
}
    | undefined;


export const SignupFormSchema = z.object({

    email: z.string().email({ message: 'Veuillez entrer un email valide' }).trim(),
    motDePasse: z
        .string()
        .min(8, { message: '8 caracteres minimum' })
        .regex(/[a-zA-Z]/, { message: 'Doit contenir au moins une lettre' })
        .regex(/[0-9]/, { message: 'Doit contenir au moins un chiffre' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Doit contenir au moins un caractere spéciale',
        })
        .trim(),
})

export type FormStateLogin =
    | {
    errors?: {
        email?: string[]
        motDePasse?: string[]
    }
    message?: string
}
    | undefined


export const AjoutStockSchema = z.object({
    quantite: z.number().min(1, { message: "La quantité doit être supérieure ou égale à 1" }),
    refLot: z.string().nonempty({ message: "La référence du lot est requise" }),
    seuilMinimum: z.number().min(0, { message: "Le seuil minimum ne peut pas être négatif" }),
reapprovisionnementAuto: z.boolean({
    required_error: "Le champ réapprovisionnement automatique est requis",
}),
});

export type AjoutStockFormState =
    | {
    errors?: {
        quantite?: string[];
        refLot?: string[];
        seuilMinimum?: string[];
        reapprovisionnementAuto?: string[];
    };
    message?: string;
}
    | undefined;


export const AjoutFournisseurSchema = z.object({
    nom: z.string().nonempty({ message: "Le nom est requis" }),
    raisonSociale: z.string().nonempty({ message: "La raison sociale est requise" }),
    email: z.string().email({ message: "Saisir un email valide" }).trim(),
    tel: z.string().regex(/^0[1-9]([ .-]?\d{2}){4}$/, {
        message: "Rentrez un numéro de téléphone français valide",
    }),
});

export type AjoutFournisseurFormState =
    | {
    errors?: {
        nom?: string[];
        raisonSociale?: string[];
        email?: string[];
        tel?: string[];
    };
    message?: string;
}
    | undefined;
