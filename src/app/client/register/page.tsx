'use client';
import Bouton from "@/components/Bouton";
import EncartForm from "@/components/EncartForm";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/api/ClientAuth";
import { RegisterFormSchema, FormState } from "@/lib/zodDefinitions";
import InfoBulle from "@/components/infoBulle";


export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: '',
        nom: '',
        prenom: '',
        tel: ''
    });
    const [errors, setErrors] = useState<FormState>({});
    const [success, setSuccess] = useState<boolean>(false);

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
        setSuccess(false);

        // Validation des champs avec Zod
        const validatedFields = RegisterFormSchema.safeParse({
            email: formData.email,
            mdp: formData.motDePasse,
            nom: formData.nom,
            prenom: formData.prenom,
            tel: formData.tel
        });

        // Si la validation échoue, affiche les erreurs
        if (!validatedFields.success) {
            setErrors({
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Veuillez corriger les erreurs ci-dessous.'
            });
            return;
        }

        try {
            // Appel du service pour créer un utilisateur
            await createClient({
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.motDePasse,
                tel: formData.tel
            });

            setSuccess(true);
            // Rediriger l'utilisateur après une inscription réussie
            router.push('/client/emailvalidation');
        } catch (error) {
            setErrors({
                message: 'Une erreur est survenue lors de l\'inscription.'
            });
            console.error(error);
        }
    };

    return (
        <EncartForm titre={"Enregistrez-vous"} customWidth={"w-[614px]"}>
            <form onSubmit={onSubmit}>
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
                            <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={`${errors.errors.email[0]}`}/>
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
                        {errors?.errors?.mdp && (
                            <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={`${errors.errors.mdp[0]}`}/>
                        )}



                        <label htmlFor="nom">Nom</label>
                        <input
                            type="text"
                            name="nom"
                            id="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                        {errors?.errors?.nom && (
                            <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={`${errors.errors.nom[0]}`}/>
                        )}



                        <label htmlFor="prenom">Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            id="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                        />
                        {errors?.errors?.prenom && (
                            <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={`${errors.errors.prenom[0]}`}/>
                        )}



                        <label htmlFor="tel">Téléphone</label>
                        <input
                            type="tel"
                            name="tel"
                            id="tel"
                            value={formData.tel}
                            onChange={handleChange}
                            required
                        />


                </div>

                {errors?.message && <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={`${errors.message}`}/>}
                {success && <InfoBulle colorClass={"bg-[#DCFCE7] text-[#022C22] border-[#022C22]"} content={"Inscription réussie !"}/>}

                <div className={"flex flex-row-reverse gap-3 mt-6"}>
                    <Bouton
                        colorClass={"bg-[#1E4147] text-white"}
                        hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        text={"Recevoir mon code"}
                        customType="submit"
                    />
                    <Bouton
                        text={"Retour"}
                        onClick={() => router.push('/')}
                    />
                </div>
            </form>
        </EncartForm>
    );
}