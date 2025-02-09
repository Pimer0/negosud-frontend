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
    password: z
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
        password?: string[]
    }
    message?: string
}
    | undefined