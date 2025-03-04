import React, { useState } from 'react';
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import InfoBulle from "@/components/infoBulle";
import {GestionStockProps} from "@/interfaces/GestionStockProps";

const GestionInv: React.FC<GestionStockProps> = ({
                                                     stockId,
                                                     articleReference,
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
        if (quantite <= seuilMinimum) return "bg-[#FECACA] text-[#450A0A] border-[#450A0A]";
        return "bg-[#DCFCE7] border-[#022C22]";
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

            if (response.ok) {
                setQuantite(newQuantite);
                onQuantityChange(stockId, newQuantite);
            } else {
                setError(`Erreur ${response.status}: ${response.statusText}`);
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

                if (response.ok) {
                    setQuantite(newQuantite);
                    onQuantityChange(stockId, newQuantite);
                } else {
                    setError(`Erreur ${response.status}: ${response.statusText}`);
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
                <p className="text-sm text-gray-600">ID: {articleReference}</p>
            </div>

<div className="flex-1 flex justify-center">
          <InfoBulle colorClass={getStockStatusClass()} content={
              quantite <= 0 ? "Rupture" :
              quantite <= seuilMinimum ? "Stock bas" :
              "Stock bon"
          }>
          </InfoBulle>
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

                >
                    <IoIosRemove size={18} />
                </button>

                <span className="w-10 text-center">{quantite}</span>

                <button
                    onClick={handleIncrement}
                    disabled={isLoading}

                >
                    <IoIosAdd size={18} />
                </button>
            </div>

            {error && <InfoBulle colorClass="col-span-full mt-1 text-red-500 text-sm" content={error}></InfoBulle>}
        </div>
    );
};

export default GestionInv;