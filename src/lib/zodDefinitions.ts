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

/*
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
*/


export const AjoutFournisseurSchema = z.object({
    nom: z.string().nonempty({ message: "Le nom est requis" }),
    raisonSociale: z.string().nonempty({ message: "La raison sociale est requise" }),
    email: z.string().email({ message: "Saisir un email valide" }).trim(),
    tel: z.string().regex(/^0[1-9]([ .-]?\d{2}){4}$/, {
        message: "Rentrez un numéro de téléphone français valide",
    }),
});

/*
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
*/
export const AjoutUtilisateurSchema = z.object({
    email: z
        .string()
        .email({ message: 'Veuillez entrer un email valide.' })
        .trim(),
    motDePasse: z
        .string()
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
        .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule.' })
        .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule.' })
        .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Le mot de passe doit contenir au moins un caractère spécial.',
        })
        .trim(),
    nom: z
        .string()
        .regex(/^[A-Z][a-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Z][a-zÀ-ÖØ-öø-ÿ]+)*$/, {
            message: 'Le nom doit commencer par une majuscule et ne pas contenir de caractères spéciaux ou de chiffres.',
        })
        .min(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
        .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères.' })
        .trim(),
    prenom: z
        .string()
        .regex(/^[A-Z][a-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Z][a-zÀ-ÖØ-öø-ÿ]+)*$/, {
            message: 'Le prénom doit commencer par une majuscule et ne pas contenir de caractères spéciaux ou de chiffres.',
        })
        .min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' })
        .max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères.' })
        .trim(),
    access_token: z
        .string()
        .optional(), // Optionnel, car il peut être généré côté serveur
    roleId: z
        .number()
        .int()
        .min(0, { message: 'L\'ID du rôle doit être un nombre entier positif.' }),
    role: z
        .string()
        .min(1, { message: 'Le rôle est requis.' })
        .max(50, { message: 'Le rôle ne peut pas dépasser 50 caractères.' }),
});

/*
export type AjoutUtilisateurFormState =
    | {
    errors?: {
        email?: string[];
        motDePasse?: string[];
        nom?: string[];
        prenom?: string[];
        roleId?: string[];
        role?: string[];
    };
    message?: string;
}
    | undefined;*/
