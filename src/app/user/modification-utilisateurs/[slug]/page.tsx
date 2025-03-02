'use client';

import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import EncartForm from "@/components/EncartForm";
import { ValidationErrorsUtilisateurs} from "@/interfaces/ValidationsErrors";
import { AjoutUtilisateurSchema } from "@/lib/zodDefinitions"; // Importez le schéma de validation

export default function ModificationUtilisateur() {
    const router = useRouter();
    const params = useParams(); // Récupère les paramètres dynamiques
    const [errors, setErrors] = useState<ValidationErrorsUtilisateurs>({});
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        utilisateurId: 0,
        email: '',
        motDePasse: '',
        nom: '',
        prenom: '',
        roleId: 0,
        role: '',
    });

    // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
    useEffect(() => {
        if (params.slug) {
            const utilisateurId = parseInt(params.slug as string, 10);
            setFormData(prevState => ({
                ...prevState,
                utilisateurId,
            }));

            // Charger les données de l'utilisateur
            const fetchUtilisateur = async () => {
                try {
                    const response = await fetch(`http://localhost:5141/api/Utilisateur/${utilisateurId}`);
                    const data = await response.json();
                    if (data.success) {
                        setFormData(prevState => ({
                            ...prevState,
                            email: data.data.email,
                            nom: data.data.nom,
                            prenom: data.data.prenom,
                            roleId: data.data.roleId,
                            role: data.data.role,
                        }));
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données de l'utilisateur", error);
                }
            };

            fetchUtilisateur();
        }
    }, [params.slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation des données avec Zod
        const result = AjoutUtilisateurSchema.safeParse(formData);
        if (!result.success) {
            setErrors({ errors: result.error.flatten().fieldErrors });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5141/api/Utilisateur/${formData.utilisateurId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                console.log("Utilisateur modifié avec succès");
                router.push("/user/gestion-utilisateurs"); // Redirection après succès
            } else {
                console.error("Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification", error);
        }
    };

    return (
        <EncartForm titre={"Modifiez un utilisateur"}>
            <form onSubmit={handleSubmit}>
                <div className={"flex flex-col"}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.email && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.email[0]}
                        />
                    )}
                </div>

                <div className={"flex flex-col"}>
                    <label htmlFor="nom">Nom</label>
                    <input
                        type="text"
                        name="nom"
                        id="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.nom && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.nom[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label htmlFor="prenom">Prénom</label>
                    <input
                        type="text"
                        name="prenom"
                        id="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.prenom && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.prenom[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label htmlFor="roleId">ID du rôle</label>
                    <input
                        type="number"
                        name="roleId"
                        id="roleId"
                        value={formData.roleId}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.roleId && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.roleId[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label htmlFor="role">Rôle</label>
                    <input
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.role && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.role[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-row justify-center gap-4 mt-8"}>
                    <Bouton
                        text={"Retour"}
                        onClick={() => router.back()}
                    />
                    <Bouton
                        text={"Modifier"}
                        colorClass={"bg-[#1E4147] text-white"}
                        hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        customType={"submit"}
                    />
                </div>
            </form>
            {success && (
                <InfoBulle
                    colorClass={"bg-[#DCFCE7] border-[#022C22]"}
                    content={"Données modifiées avec succès !"}
                />
            )}
        </EncartForm>
    );
}