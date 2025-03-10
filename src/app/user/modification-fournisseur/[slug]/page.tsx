'use client';

import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import EncartForm from "@/components/EncartForm";
import {ValidationErrors} from "@/interfaces/ValidationsErrors";


export default function ModificationFournisseur() {
    const router = useRouter();
    const params = useParams(); // Récupère les paramètres dynamiques
    const [errors] = useState<ValidationErrors>({});
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fournisseurId: 0,
        nom: '',
        raisonSociale: '',
        email: '',
        tel: '',
    });

    // Récupérer le `slug` (ID du fournisseur) depuis les paramètres de l'URL
    useEffect(() => {
        if (params.slug) {
            const fournisseurId = parseInt(params.slug as string, 10);
            setFormData(prevState => ({
                ...prevState,
                fournisseurId,
            }));

            // Charger les données du fournisseur
            const fetchFournisseur = async () => {
                try {
                    const response = await fetch(`http://localhost:5141/api/Fournisseur/${fournisseurId}`);
                    const data = await response.json();
                    if (data.success) {
                        setFormData(prevState => ({
                            ...prevState,
                            nom: data.data.nom,
                            raisonSociale: data.data.raisonSociale,
                            email: data.data.email,
                            tel: data.data.tel,
                        }));
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données du fournisseur", error);
                }
            };

            fetchFournisseur();
        }
    }, [params.slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5141/api/Fournisseur/${formData.fournisseurId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                console.log("Fournisseur modifié avec succès");
                router.push("/user/gestion-stocks-fournisseurs")
            } else {
                console.error("Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification", error);
        }
    };

    return (
        <EncartForm titre={"Modifiez un fournisseur"}>
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="raisonSociale">Raison Sociale</label>
                    <input
                        type="text"
                        name="raisonSociale"
                        id="raisonSociale"
                        value={formData.raisonSociale}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.raisonSociale && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.raisonSociale[0]}
                        />
                    )}
                </div>
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
                    <label htmlFor="tel">Téléphone</label>
                    <input
                        type="tel"
                        name="tel"
                        id="tel"
                        value={formData.tel}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.tel && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.tel[0]}
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