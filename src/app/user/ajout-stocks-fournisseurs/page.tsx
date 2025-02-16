'use client';
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import React, { useState } from "react";
import { AjoutStockSchema, AjoutFournisseurSchema } from "@/lib/zodDefinitions";
import InfoBulle from "@/components/infoBulle";

interface ValidationErrors {
    errors?: {
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

export default function AjoutStocksFournisseurs() {
    const [formType, setFormType] = useState("stock");
    const [formData, setFormData] = useState({
        quantite: '',
        refLot: '',
        seuilMinimum: '',
        reapprovisionnementAuto: 'Oui',
        nom: '',
        raisonSociale: '',
        email: '',
        tel: '',
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setSuccess(false);

        let data;
        let url: string | undefined;

        if (formType === "stock") {
            data = {
                quantite: Number(formData.quantite),
                refLot: formData.refLot,
                seuilMinimum: Number(formData.seuilMinimum),
                reapprovisionnementAuto: formData.reapprovisionnementAuto === "Oui",
            };

            const result = AjoutStockSchema.safeParse(data);
            if (!result.success) {
                const validationErrors = result.error.flatten().fieldErrors;
                setErrors({ errors: validationErrors });
                return;
            }

            url = "http://localhost:5141/api/Stocks";

        } else if (formType === "fournisseur") {
            data = {
                nom: formData.nom,
                raisonSociale: formData.raisonSociale,
                email: formData.email,
                tel: formData.tel,
            };

            const result = AjoutFournisseurSchema.safeParse(data);
            if (!result.success) {
                const validationErrors = result.error.flatten().fieldErrors;
                setErrors({ errors: validationErrors });
                return;
            }

            url = "http://localhost:5141/api/Fournisseur";
        }

        if (url) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    setSuccess(true);
                    setFormData({
                        quantite: '',
                        refLot: '',
                        seuilMinimum: '',
                        reapprovisionnementAuto: 'Oui',
                        nom: '',
                        raisonSociale: '',
                        email: '',
                        tel: '',
                    });
                } else {
                    setErrors({ errors: { general: ["Erreur lors de la soumission des données."] } });
                }
            } catch (error) {
                setErrors({ errors: { general: ["Erreur lors de la connexion au serveur."] } });
                console.error("Erreur lors de la soumission des données:", error);
            }
        }
    };

    const handleFormTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormType(event.target.value);
        setErrors({});
        setSuccess(false);
    };

    return (
        <EncartForm titre={"Ajoutez une donnée"}>
            <div className={"flex flex-col"}>
                <div className={"border-b-gray-400 border-b mb-4"}>
                    <fieldset onChange={(e) => handleFormTypeChange(e as React.ChangeEvent<HTMLInputElement>)}>
                        <legend>Choisissez une donnée à ajouter:</legend>
                        <div>
                            <input type="radio" id="stock" name="type" value="stock" checked={formType === "stock"} />
                            <label htmlFor="stock">Stock</label>
                        </div>
                        <div>
                            <input type="radio" id="fournisseur" name="type" value="fournisseur" checked={formType === "fournisseur"} />
                            <label htmlFor="fournisseur">Fournisseur</label>
                        </div>
                    </fieldset>
                </div>
                {formType === "stock" && (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="quantite">Quantité</label>
                            <input
                                type="number"
                                name="quantite"
                                id="quantite"
                                value={formData.quantite}
                                onChange={handleChange}
                                required
                            />
                            {errors.errors?.quantite && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.quantite?.[0]}
                                />
                            )}
                        </div>
                        <div>
                            <label htmlFor="refLot">Référence du lot</label>
                            <input
                                type="text"
                                name="refLot"
                                id="refLot"
                                value={formData.refLot}
                                onChange={handleChange}
                                required
                            />
                            {errors.errors?.refLot && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.refLot?.[0]}
                                />
                            )}
                        </div>
                        <div>
                            <label htmlFor="seuilMinimum">Seuil minimum</label>
                            <input
                                type="number"
                                name="seuilMinimum"
                                id="seuilMinimum"
                                value={formData.seuilMinimum}
                                onChange={handleChange}
                                required
                            />
                            {errors.errors?.seuilMinimum && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.seuilMinimum?.[0]}
                                />
                            )}
                        </div>
                        <div>
                            <label htmlFor="reapprovisionnementAuto">Réapprovisionnement auto</label>
                            <div>
                                <input
                                    type="radio"
                                    name="reapprovisionnementAuto"
                                    value="Oui"
                                    checked={formData.reapprovisionnementAuto === "Oui"}
                                    onChange={handleChange}
                                />
                                <label>Oui</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="reapprovisionnementAuto"
                                    value="Non"
                                    checked={formData.reapprovisionnementAuto === "Non"}
                                    onChange={handleChange}
                                />
                                <label>Non</label>
                            </div>
                            {errors.errors?.reapprovisionnementAuto && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.reapprovisionnementAuto?.[0]}
                                />
                            )}
                        </div>
                        <div className={"flex flex-row justify-center gap-4 mt-8"}>
                            <Bouton text={"Retour"} />
                            <Bouton
                                text={"Créer"}
                                colorClass={"bg-[#1E4147] text-white"}
                                hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                                customType={"submit"}
                            />
                        </div>
                    </form>
                )}
                {formType === "fournisseur" && (
                    <form onSubmit={handleSubmit}>
                        <div>
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
                                    content={errors.errors.nom?.[0]}
                                />
                            )}
                        </div>
                        <div>
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
                                    content={errors.errors.raisonSociale?.[0]}
                                />
                            )}
                        </div>
                        <div>
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
                                    content={errors.errors.email?.[0]}
                                />
                            )}
                        </div>
                        <div>
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
                                    content={errors.errors.tel?.[0]}
                                />
                            )}
                        </div>
                        <div className={"flex flex-row justify-center gap-4 mt-8"}>
                            <Bouton text={"Retour"} />
                            <Bouton
                                text={"Créer"}
                                colorClass={"bg-[#1E4147] text-white"}
                                hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                                customType={"submit"}
                            />
                        </div>
                    </form>
                )}
                {success && (
                    <InfoBulle
                        colorClass={"bg-[#DCFCE7] border-[#022C22]"}
                        content={"Données créées avec succès !"}
                    />
                )}
                {errors.errors?.general && (
                    <InfoBulle
                        colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                        content={errors.errors.general?.[0]}
                    />
                )}
            </div>
        </EncartForm>
    );
}