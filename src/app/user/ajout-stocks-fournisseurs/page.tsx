'use client';
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import React, { useState } from "react";
import { AjoutStockSchema, AjoutFournisseurSchema } from "@/lib/zodDefinitions";
import InfoBulle from "@/components/infoBulle";
import { useRouter } from "next/navigation";

interface ValidationErrors {
    errors?: {
        articleId?: string[];
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
    const router = useRouter();
    const [formType, setFormType] = useState("stock");
    const [formData, setFormData] = useState({
        articleId: 0, // Initialisé à 0
        quantite: 0, // Initialisé à 0
        refLot: '', // Chaîne vide
        seuilMinimum: 0, // Initialisé à 0
        reapprovisionnementAuto: true, // Booléen
        nom: '', // Chaîne vide
        raisonSociale: '', // Chaîne vide
        email: '', // Chaîne vide
        tel: '', // Chaîne vide
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === "articleId" || name === "quantite" || name === "seuilMinimum" ? Number(value) : value,
        }));
    };

    const handleReapprovisionnementAutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "Oui"; // Convertir en booléen
        setFormData(prevState => ({
            ...prevState,
            reapprovisionnementAuto: value,
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
                articleId: formData.articleId,
                quantite: formData.quantite,
                refLot: formData.refLot,
                seuilMinimum: formData.seuilMinimum,
                reapprovisionnementAuto: formData.reapprovisionnementAuto,
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
                        articleId: 0,
                        quantite: 0,
                        refLot: '',
                        seuilMinimum: 0,
                        reapprovisionnementAuto: true,
                        nom: '',
                        raisonSociale: '',
                        email: '',
                        tel: '',
                    });
                    router.push("/user/gestion-stocks-fournisseurs");
                } else {
                    const errorText = await response.text();
                    console.log("Réponse d'erreur de l'API:", errorText);
                    setErrors({ errors: { general: [errorText || "Erreur lors de la soumission des données."] } });
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
                    <fieldset onChange={(e) => handleFormTypeChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}>
                        <legend>Choisissez une donnée à ajouter:</legend>
                        <div>
                            <input type="radio" id="stock" name="type" value="stock" checked={formType === "stock"} className={"m-3 w-fit"}/>
                            <label htmlFor="stock">Stock</label>
                        </div>
                        <div>
                            <input type="radio" id="fournisseur" name="type" value="fournisseur" checked={formType === "fournisseur"} className={"m-3 w-fit"}/>
                            <label htmlFor="fournisseur">Fournisseur</label>
                        </div>
                    </fieldset>
                </div>
                {formType === "stock" && (
                    <form onSubmit={handleSubmit}>
                        <div className={"flex flex-col"}>
                            <label htmlFor="articleId">ID de l&apos;article</label>
                            <input
                                type="number"
                                name="articleId"
                                id="articleId"
                                value={formData.articleId}
                                onChange={handleChange}
                                required
                            />
                            {errors.errors?.articleId && (
                                <InfoBulle
                                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                    content={errors.errors.articleId[0]}
                                />
                            )}
                        </div>

                        <div className={"flex flex-col"}>
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
                        <div className={"flex flex-col"}>
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
                        <div className={"flex flex-col"}>
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
                        <div className={"flex flex-col"}>
                            <label htmlFor="reapprovisionnementAuto">Réapprovisionnement auto</label>
                            <div>
                                <input
                                    type="radio"
                                    name="reapprovisionnementAuto"
                                    value="Oui"
                                    checked={formData.reapprovisionnementAuto === true}
                                    onChange={handleReapprovisionnementAutoChange} // Gestionnaire onChange
                                    className={"m-3 w-fit"}
                                />
                                <label>Oui</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="reapprovisionnementAuto"
                                    value="Non"
                                    checked={formData.reapprovisionnementAuto === false}
                                    onChange={handleReapprovisionnementAutoChange} // Gestionnaire onChange
                                    className={"m-3 w-fit"}
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
                            <Bouton
                                text={"Retour"}
                                onClick={() => router.back()}
                            />
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
                                    content={errors.errors.nom?.[0]}
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
                                    content={errors.errors.raisonSociale?.[0]}
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
                                    content={errors.errors.email?.[0]}
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
                                    content={errors.errors.tel?.[0]}
                                />
                            )}
                        </div>
                        <div className={"flex flex-row justify-center gap-4 mt-8"}>
                            <Bouton
                                text={"Retour"}
                                onClick={() => router.back()}
                            />
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