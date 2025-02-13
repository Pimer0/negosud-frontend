'use client'

import EncartForm from "@/components/EncartForm";
import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FormStateLogin, SignupFormSchema } from "@/lib/zodDefinitions";
import { loginUtilisateur } from "@/services/api/UserAuth";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: ''
    });

    const [errors, setErrors] = useState<FormStateLogin>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});


        // Validation des champs avec Zod
        const validatedFields = SignupFormSchema.safeParse({
            email: formData.email,
            motDePasse: formData.motDePasse,
        });

        if (!validatedFields.success) {
            setErrors({
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Veuillez corriger les erreurs ci-dessous.'
            });
            return;
        }

        try {
            // Appel du service pour log un client
            await loginUtilisateur({
                email: formData.email,
                motDePasse: formData.motDePasse
            });


            // Rediriger l'utilisateur après une connexion réussie
            router.back();
        } catch (error) {
            setErrors({
                message: 'Une erreur est survenue lors de la connexion.'
            });
            console.error(error);
        }
    }

    return (
        <EncartForm titre={"Connectez vous à votre espace employé"} customWidth={"w-[614px]"}>
            <form onSubmit={onSubmit} className="mt-6">
                <div className={"flex flex-col gap-4"}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-describedby="email-error"
                    />
                    {errors?.errors?.email && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors.email[0]}

                        />
                    )}

                    <label htmlFor="motDePasse">Mot de passe</label>
                    <input
                        type="password"
                        name="motDePasse"
                        id="motDePasse"
                        value={formData.motDePasse}
                        onChange={handleChange}
                        required
                        aria-describedby="password-error"
                    />
                    {errors?.errors?.motDePasse && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors.motDePasse[0]}

                        />
                    )}

                    <Bouton
                        colorClass={"bg-[#1E4147] text-white"}
                        hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        text={"Connexion"}
                        customType="submit"
                    />
                </div>
            </form>
        </EncartForm>
    )
}
