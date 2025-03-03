import React, { useState } from 'react';
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import InfoBulle from "@/components/infoBulle";

interface GestionStockProps {
    stockId: number;
    articleId: number;
    libelle: string;
    quantiteActuelle: number;
    seuilMinimum: number;
    reapprovisionnementAuto: boolean;
    onQuantityChange: (stockId: number, newQuantite: number) => void;
}

const GestionInv: React.FC<GestionStockProps> = ({
                                                       stockId,
                                                       articleId,
                                                       libelle,
                                                       quantiteActuelle,
                                                       seuilMinimum,
                                                       reapprovisionnementAuto,
                                                       onQuantityChange,
                                                   }) => {
    const [quantite, setQuantite] = useState<number>(quantiteActuelle);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
            const response = await fetch(`http://localhost:5141/api/Stocks/UpdateStockQuantity/${stockId}`, {
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
                const response = await fetch(`http://localhost:5141/api/Stocks/UpdateStockQuantity/${stockId}`, {
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
            </div>

            {error && <InfoBulle colorClass="col-span-full mt-1 text-red-500 text-sm" content={error}></InfoBulle>}
        </div>
    );
};

export default GestionInv;