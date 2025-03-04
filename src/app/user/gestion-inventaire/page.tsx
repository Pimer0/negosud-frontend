'use client'
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import GestionInv from "@/components/GestionInv";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import InfoBulle from "@/components/infoBulle";
import {StockData} from "@/interfaces/GestionStockProps";


export default function GestionInventaire() {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5141/api/Stocks');
                const data = await response.json();

                if (data?.success && data?.data) {
                    setStocks(data.data);
                } else {
                    setError("Impossible de récupérer les données de stock");
                    console.error("Données invalides reçues :", data);
                }
            } catch (error) {
                setError("Erreur de connexion au serveur");
                console.error('Erreur lors de la récupération des stocks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const handleQuantityChange = (stockId: number, newQuantite: number) => {
        setStocks(prevStocks =>
            prevStocks.map(stock =>
                stock.stockId === stockId ? {...stock, quantite: newQuantite} : stock
            )
        );
    };

    return (
        <div>
            <EncartForm titre={"Gestion des Stocks"} customWidth={"w-[750px]"}>
                <div>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <p>Chargement des stocks...</p>
                        </div>
                    ) : error ? (
                        <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={error}/>
                    ) : (
                        <div className="mb-8 w-[693px]">
                            <div className="mb-4 grid grid-cols-5 font-bold border-b border-gray-400 py-2">
                                <div>Article</div>
                                <div className="text-center ">Statut</div>
                                <div className="text-center">Seuil min.</div>
                                <div className="text-center">Réappro.</div>
                                <div className="text-right">Actions</div>
                            </div>
                            {stocks.map((stock) => (
                                <GestionInv
                                    key={stock.stockId}
                                    stockId={stock.stockId}
                                    articleReference={stock.articleReference}
                                    libelle={stock.libelle}
                                    quantiteActuelle={stock.quantite}
                                    seuilMinimum={stock.seuilMinimum}
                                    reapprovisionnementAuto={stock.reapprovisionnementAuto}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex flex-row justify-center gap-4 mt-8">
                        <Bouton
                            text={"Retour"}

                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                            onClick={() => router.back()}
                        />
                    </div>
                </div>
            </EncartForm>
        </div>
    );
}