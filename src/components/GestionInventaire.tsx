import React, { useState } from 'react';
import { IoIosAdd, IoIosRemove, IoMdRefresh } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface GestionStockProps {
    stockId: number;
    articleId: number;
    libelle: string;
    quantiteActuelle: number;
    seuilMinimum: number;
    reapprovisionnementAuto: boolean;
    onQuantityChange: (stockId: number, newQuantite: number) => void;
    onViewHistory: (stockId: number) => void;
}

interface HistoriqueModification {
    date: string;
    utilisateur: string;
    ancienneQuantite: number;
    nouvelleQuantite: number;
    typeModification: string;
}

const GestionInventaire: React.FC<GestionStockProps> = ({
                                                       stockId,
                                                       articleId,
                                                       libelle,
                                                       quantiteActuelle,
                                                       seuilMinimum,
                                                       reapprovisionnementAuto,
                                                       onQuantityChange,
                                                       onViewHistory
                                                   }) => {
    const [quantite, setQuantite] = useState<number>(quantiteActuelle);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const getStockStatusClass = () => {
        if (quantite <= 0) return "text-red-600 font-bold";
        if (quantite <= seuilMinimum) return "text-orange-500 font-bold";
        return "text-green-600 font-bold";
    };

    const handleIncrement = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newQuantite = quantite + 1;
            const response = await fetch(`http://localhost:5141/api/Stock/UpdateQuantity/${stockId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stockId: stockId,
                    nouvelleQuantite: newQuantite,
                    utilisateurId: 1, // Remplacer par l'ID de l'utilisateur connecté
                    typeModification: 'Ajout manuel'
                }),
            });

            const data = await response.json();
            if (data.success) {
                setQuantite(newQuantite);
                onQuantityChange(stockId, newQuantite);
            } else {
                setError(data.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            setError("Erreur réseau lors de la mise à jour");
            console.error('Erreur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrement = async () => {
        if (quantite > 0) {
            setIsLoading(true);
            setError(null);
            try {
                const newQuantite = quantite - 1;
                const response = await fetch(`http://localhost:5141/api/Stock/UpdateQuantity/${stockId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        stockId: stockId,
                        nouvelleQuantite: newQuantite,
                        utilisateurId: 1, // Remplacer par l'ID de l'utilisateur connecté
                        typeModification: 'Retrait manuel'
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    setQuantite(newQuantite);
                    onQuantityChange(stockId, newQuantite);
                } else {
                    setError(data.message || "Erreur lors de la mise à jour");
                }
            } catch (error) {
                setError("Erreur réseau lors de la mise à jour");
                console.error('Erreur:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleViewHistory = () => {
        onViewHistory(stockId);
    };

    const handleReapprovisionnement = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5141/api/Stock/Reapprovisionner/${articleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (data.success) {
                setError(null);
                // Afficher un message de succès temporaire
                alert("Demande de réapprovisionnement envoyée avec succès");
            } else {
                setError(data.message || "Erreur lors de la demande de réapprovisionnement");
            }
        } catch (error) {
            setError("Erreur réseau lors de la demande de réapprovisionnement");
            console.error('Erreur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between border-b border-gray-200 py-3">
            <div className="flex-1">
                <p className="font-semibold">{libelle}</p>
                <p className="text-sm text-gray-600">ID: {articleId}</p>
            </div>

            <div className="flex-1 flex justify-center">
                <div className={getStockStatusClass()}>
                    {quantite} {quantite <= seuilMinimum && quantite > 0 && "(Bas)"}
                    {quantite <= 0 && "(Rupture)"}
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <p className="text-gray-600">Seuil min: {seuilMinimum}</p>
            </div>

            <div className="flex-1 flex justify-center">
                <p>{reapprovisionnementAuto ? "Auto" : "Manuel"}</p>
            </div>

            <div className="flex-1 flex items-center justify-end gap-2">
                <button
                    onClick={handleDecrement}
                    disabled={isLoading || quantite <= 0}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                >
                    <IoIosRemove size={18} />
                </button>

                <span className="w-10 text-center">{quantite}</span>

                <button
                    onClick={handleIncrement}
                    disabled={isLoading}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                >
                    <IoIosAdd size={18} />
                </button>

                <button
                    onClick={handleViewHistory}
                    className="p-2 ml-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                    title="Voir l'historique"
                >
                    <FaHistory size={16} />
                </button>

                <button
                    onClick={handleReapprovisionnement}
                    disabled={isLoading}
                    className="p-2 ml-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                    title="Demander un réapprovisionnement"
                >
                    <IoMdRefresh size={18} />
                </button>
            </div>

            {error && <div className="col-span-full mt-1 text-red-500 text-sm">{error}</div>}
        </div>
    );
};

export default GestionInventaire;