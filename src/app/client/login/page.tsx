'use client';
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { FormStateLogin, SignupFormSchema } from "@/lib/zodDefinitions";
import { useRouter } from "next/navigation";
import { getClientByEmail, loginClient } from "@/services/api/ClientAuth";
import InfoBulle from "@/components/infoBulle";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: ''
    });
    const [firstFormData, setFirstFormData] = useState({
        email: ''
    });
    const [errors, setErrors] = useState<FormStateLogin>({});
    const [success, setSuccess] = useState<boolean>(false);
    const [foundMail, setFoundMail] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFirstFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFirstFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // On submit à appeler lors du deuxieme form
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setSuccess(false);

        // Validation des champs avec Zod
        const validatedFields = SignupFormSchema.safeParse({
            email: formData.email,
            mdp: formData.motDePasse,
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
            await loginClient({
                email: formData.email,
                motDePasse: formData.motDePasse
            });

            setSuccess(true);
            // Rediriger l'utilisateur après une connexion réussie
            router.push('/client/emailvalidation');
        } catch (error) {
            setErrors({
                message: 'Une erreur est survenue lors de la connexion.'
            });
            console.error(error);
        }
    };

    const onFirstSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setFoundMail(false);

        try {
            // Appel du service pour trouver un utilisateur
            const response = await getClientByEmail({
                email: firstFormData.email
            });

            // Vérifie si l'email existe en BDD
            if (response.data === true) {
                setFoundMail(true); // Affiche le deuxième formulaire
                setFormData(prevState => ({ ...prevState, email: firstFormData.email })); // Pré-remplit l'email dans le deuxième formulaire
            } else {
                setErrors({
                    message: 'Aucun compte trouvé avec cet email. Veuillez vous inscrire.'
                });
            }
        } catch (error) {
            setErrors({
                message: 'Une erreur est survenue lors de la vérification de l\'email.'
            });
            console.error(error);
        }
    };

    return (
        <EncartForm titre={"Connectez-vous"} customWidth={"w-[614px]"}>
            {/* Premier formulaire : Vérification de l'email */}
            {!foundMail && (
            <form onSubmit={onFirstSubmit}>
                <div className={"flex flex-col gap-4"}>

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={firstFormData.email}
                            onChange={handleFirstFormChange}
                            required
                        />


                    <Bouton
                        colorClass={"bg-[#1E4147] text-white"}
                        hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        text={"Vérifier l'email"}
                        customType="submit"
                    />
                </div>
            </form>)}

            {/* Affichage des erreurs ou succès du premier formulaire */}
            {errors?.message && (
                <InfoBulle
                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                    content={errors.message}
                />
            )}

            {/* Deuxième formulaire : Connexion (affiché seulement si l'email est trouvé) */}
            {foundMail && (
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
                            />
                            {errors?.errors?.email && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.email[0]}
                                />
                            )}



                            <label htmlFor="mdp">Mot de passe</label>
                            <input
                                type="password"
                                name="motDePasse"
                                id="mdp"
                                value={formData.motDePasse}
                                onChange={handleChange}
                                required
                            />
                            {errors?.errors?.password && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.password[0]}
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
            )}

            {/* Affichage des erreurs ou succès du deuxième formulaire */}
            {success && (
                <InfoBulle
                    colorClass={"bg-[#DCFCE7] border-[#022C22]"}
                    content={"Connexion réussie ! Redirection..."}
                />
            )}

            {/* Lien vers la page d'administration */}
            <Link className={`underline text-[#1E414] leading-none mb-3 mt-6`} href={"/admin/login"}>
                Vous êtes un administrateur du site ?
            </Link>
        </EncartForm>
    );
}