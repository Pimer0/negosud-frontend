'use client'

import React, { useEffect, useState } from "react";
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import { IoMdAdd } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa6";
import GestionStocks from "@/components/GestionStock";
import {StockProps} from "@/interfaces/StockProps";

export default function GestionStocksFournisseurs() {
    const [stocks, setStocks] = useState([]);

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

        fetchStocks();
    }, []);

    return (
        <div>
            <EncartForm titre={"Gestion des stocks / fournisseurs"}>
                <div>
                    <div className={"mb-8"}>
                        <div className={"mb-8"}>
                            <h3 className={"font-extrabold"}>Fournisseurs</h3>
                        </div>
                        <div className={"pb-4 flex flex-row gap-8 border-b border-b-gray-400"}>
                            <p>Nom</p>
                            <p>Raison sociale</p>
                            <p>Email</p>
                            <p>Telephone</p>
                            <p>Edition</p>
                        </div>
                    </div>
                    <div>
                        <div className={"mb-8"}>
                            <h3 className={"font-extrabold"}>Stocks</h3>
                        </div>
                        <div className={"pb-4 flex flex-row gap-8 border-b border-b-gray-400"}>
                            <p>Ref lot</p>
                            <p>Quantité</p>
                            <p>Seuil minimum</p>
                            <p>Réapprovisionnement auto</p>
                            <p>Article</p>
                            <p>Edition</p>
                        </div>
                        {stocks.map((stock : StockProps) => (
                            <GestionStocks
                                key={stock.stockId}
                                stockId={stock.stockId}
                                articleReference={stock.articleReference}
                                quantite={stock.quantite}
                                seuilMinimum={stock.seuilMinimum}
                                reapprovisionnementAuto={stock.reapprovisionnementAuto}
                            />
                        ))}
                    </div>
                    <div className={"flex flex-row justify-center gap-4 mt-8"}>
                        <Bouton
                            text={"Ajout"}
                            childrenIcon={<IoMdAdd />}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
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
