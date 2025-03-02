'use client'
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import {IoMdAdd} from "react-icons/io";
import {FaCartPlus} from "react-icons/fa6";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ProduitProps} from "@/interfaces/ProduitProps";
import {ProduitData} from "@/interfaces/ProduitData";

export default function GestionInventaire() {
    const [produits, setProduits] = useState<ProduitData[]>([]);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch('http://localhost:5141/api/Article');
                const data = await response.json();

                if (data?.data) {
                    setProduits(data.data);
                } else {
                    console.error("Données invalides reçues :", data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
            }
        };

        fetchProduits();
    }, []);

    const router = useRouter();
    return (
        <div>
            <EncartForm titre={"Inventaire"}>
                <div>
                    <div className="mb-8">
                        <div className="mb-4 font-bold border-b border-gray-400">
                            <h3 className="font-extrabold">Produits</h3>
                        </div>
                        {produits.map((article: ProduitProps, index) => (
                            <GestionInventaire
                                key={index}
                                articleId={article.articleId}
                                libelle={article.libelle}
                            />
                        ))}
                    </div>
                    <div className={"flex flex-row justify-center gap-4 mt-8"}>
                        <Bouton
                            text={"Retour"}
                            childrenIcon={<IoMdAdd size={25}/>}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                            onClick={() => router.back()}
                        />
                        <Bouton
                            text={"Enregistrer"}
                            childrenIcon={<FaCartPlus style={{ marginLeft: "1rem" }} size={25} />}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        />
                    </div>
                </div>
            </EncartForm>
        </div>
    )
}