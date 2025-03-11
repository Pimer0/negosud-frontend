'use client'

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EncartForm from "@/components/EncartForm";
import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";
import {ValidationErrors} from "@/interfaces/ValidationsErrors";

export default function ModificationStock() {
    const router = useRouter();
    const params = useParams(); // Récupère les paramètres dynamiques
    const [errors] = useState<ValidationErrors>({});
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        stockId: 0,
        quantite: 0,
        refLot: "",
        seuilMinimum: 0,
        reapprovisionnementAuto: true,
    });

    useEffect(() => {
        if (params.slug) {
            const stockId = parseInt(params.slug as string, 10);
            setFormData(prevState => ({
                ...prevState,
                stockId,
            }));

            // Charger les données du stock
            const fetchStocks = async () => {
                try {
                    const response = await fetch(`http://localhost:5141/api/Stocks/${stockId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setFormData(prevState => ({
                            ...prevState,
                            stockId: stockId,
                            quantite: data.quantite,
                            refLot: data.refLot,
                            seuilMinimum: data.seuilMinimum,
                            reapprovisionnementAuto: data.reapprovisionnementAuto,
                        }));
                    } else {
                        console.error("Erreur lors de la récupération des données du stock");
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données du stock", error);
                }
            };

            fetchStocks();
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

        try {
            const response = await fetch(`http://localhost:5141/api/Stocks/${formData.stockId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                console.log("Stock modifié avec succès");
                router.push("/user/gestion-stocks-fournisseurs");
            } else {
                console.error("Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification", error);
        }
    };

    return (
        <EncartForm titre={"Modifiez un stock"}>
            <form onSubmit={handleSubmit}>
                <div className={"flex flex-col"}>
                    <label htmlFor="refLot">Ref lot</label>
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
                            content={errors.errors?.refLot[0]}
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
                            content={errors.errors?.quantite[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label htmlFor="reapprovisionnementAuto">Réapprovisionnement auto</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                className={"m-3 w-fit"}
                                type="radio"
                                name="reapprovisionnementAuto"
                                value="true"
                                checked={formData.reapprovisionnementAuto}
                                onChange={() => setFormData(prevState => ({ ...prevState, reapprovisionnementAuto: true }))}
                            />
                            Oui
                        </label>
                        <label>
                            <input
                                className={"m-3 w-fit"}
                                type="radio"
                                name="reapprovisionnementAuto"
                                value="false"
                                checked={!formData.reapprovisionnementAuto}
                                onChange={() => setFormData(prevState => ({ ...prevState, reapprovisionnementAuto: false }))}
                            />
                            Non
                        </label>
                    </div>
                    {errors.errors?.reapprovisionnementAuto && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.reapprovisionnementAuto[0]}
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
                            content={errors.errors?.seuilMinimum[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-row justify-center gap-4 mt-8"}>
                    <Bouton
                        text={"Retour"}
                        onClick={() => router.back()}
                        customType={"button"}
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