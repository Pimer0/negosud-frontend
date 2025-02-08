'use client';
import Bouton from "@/components/Bouton";
import EncartForm from "@/components/EncartForm";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/api/ClientAuth"; // Assure-toi d'importer ton service

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: '',
        nom: '',
        prenom: '',
        tel: ''
    });
    const [error, setError] = useState<string | null>(null);
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
        setError(null);
        setSuccess(false);

        try {
            // Appel du service pour créer un utilisateur
            await createUser({
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.motDePasse,
                tel: formData.tel
            });

            setSuccess(true);
            // Rediriger l'utilisateur après une inscription réussie
            router.push('/login');
        } catch (error) {
            setError('Une erreur est survenue lors de l\'inscription.');
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



                        <label htmlFor="mdp">Mot de passe</label>
                        <input
                            type="password"
                            name="motDePasse"
                            id="mdp"
                            value={formData.motDePasse}
                            onChange={handleChange}
                            required
                        />



                        <label htmlFor="nom">Nom</label>
                        <input
                            type="text"
                            name="nom"
                            id="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />



                        <label htmlFor="prenom">Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            id="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                        />



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

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">Inscription réussie !</p>}

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