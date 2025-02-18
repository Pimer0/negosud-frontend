'use client'
import React, { useEffect, useState } from "react";
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import { IoMdAdd } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa6";
import GestionStocks from "@/components/GestionStock";
import GestionFournisseur from "@/components/GestionFournisseur";
import { FournisseurProps } from "@/interfaces/FournisseurProps";
import { StockProps } from "@/interfaces/StockProps";
import { useRouter } from "next/navigation";

export default function GestionStocksFournisseurs() {
    const [stocks, setStocks] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch("http://localhost:5141/api/Stocks");
                const data = await response.json();
                if (data.success) {
                    setStocks(data.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des stocks:", error);
            }
        };

        const fetchFournisseurs = async () => {
            try {
                const response = await fetch("http://localhost:5141/api/Fournisseur");
                const data = await response.json();
                if (data.success) {
                    setFournisseurs(data.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des fournisseurs:", error);
            }
        };

        fetchStocks();
        fetchFournisseurs();
    }, []);

    const handleDeleteStock = (stockId: number) => {
        setStocks((prevStocks) => prevStocks.filter((stock: StockProps) => stock.stockId !== stockId));
    };

    const handleDeleteFournisseur = (fournisseurId: number) => {
        setFournisseurs((prevFournisseurs) =>
            prevFournisseurs.filter((fournisseur: FournisseurProps) => fournisseur.fournisseurId !== fournisseurId)
        );
    };

    return (
        <div>
            <EncartForm titre={"Gestion des stocks / fournisseurs"}>
                <div>
                    <div className={"mb-8"}>
                        <div className={"mb-8"}>
                            <h3 className={"font-extrabold"}>Fournisseurs</h3>
                        </div>
                        <div className={"pb-4 flex flex-row gap-8 border-b border-b-gray-400"}>
                            <p className="w-1/6">Nom</p>
                            <p className="w-1/6">Raison sociale</p>
                            <p className="w-1/6">Email</p>
                            <p className="w-1/6">Telephone</p>
                            <p className="w-1/6">Adresse</p>
                            <p className="w-1/6">Edition</p>
                        </div>
                        {fournisseurs.map((fournisseur: FournisseurProps, index) => (
                            <GestionFournisseur
                                key={index}
                                fournisseurId={fournisseur.fournisseurId}
                                nom={fournisseur.nom}
                                raisonSociale={fournisseur.raisonSociale}
                                email={fournisseur.email}
                                tel={fournisseur.tel}
                                adresse={fournisseur.adresse}
                                onDelete={handleDeleteFournisseur} // Passer la fonction de suppression
                            />
                        ))}
                    </div>
                    <div>
                        <div className={"mb-8"}>
                            <h3 className={"font-extrabold"}>Stocks</h3>
                        </div>
                        <div className={"pb-4 flex flex-row gap-8 border-b border-b-gray-400"}>
                            <p className="w-1/6">Ref lot</p>
                            <p className="w-1/6">Quantité</p>
                            <p className="w-1/6">Seuil minimum</p>
                            <p className="w-1/6">Réapprovisionnement auto</p>
                            <p className="w-1/6">Article</p>
                            <p className="w-1/6">Suppression</p>
                        </div>
                        {stocks.map((stock: StockProps) => (
                            <GestionStocks
                                key={stock.stockId}
                                stockId={stock.stockId}
                                articleReference={stock.articleReference}
                                quantite={stock.quantite}
                                seuilMinimum={stock.seuilMinimum}
                                reapprovisionnementAuto={stock.reapprovisionnementAuto}
                                onDelete={handleDeleteStock}
                            />
                        ))}
                    </div>
                    <div className={"flex flex-row justify-center gap-4 mt-8"}>
                        <Bouton
                            text={"Ajout"}
                            childrenIcon={<IoMdAdd />}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                            onClick={() => router.push("/user/ajout-stocks-fournisseurs")}
                        />
                        <Bouton
                            text={"Passer commande"}
                            childrenIcon={<FaCartPlus />}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        />
                    </div>
                </div>
            </EncartForm>
        </div>
    );
}
