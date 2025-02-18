import React from "react";
import { MdDeleteOutline } from "react-icons/md";

interface BoutonSuppressionProps {
    entityId: number;
    entityType: "stock" | "fournisseur";
    onDelete: (id: number) => void;
}

const BoutonSuppression = ({ entityId, entityType, onDelete }: BoutonSuppressionProps) => {
    const handleSuppression = async () => {
        try {
            const endpoint = entityType === "stock"
                ? `http://localhost:5141/api/Stocks/${entityId}`
                : `http://localhost:5141/api/Fournisseur/${entityId}`;

            const reponse = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (reponse.ok) {
                console.log(`${entityType} supprimé avec succès`);
                onDelete(entityId); // Mettre à jour l'état après suppression
            } else {
                console.error("Erreur lors de la suppression");
            }
        } catch (e) {
            console.error("Erreur lors de la suppression", e);
        }
    };

    return (
        <div>
            <button onClick={handleSuppression}><MdDeleteOutline size={30} /></button>
        </div>
    );
};

export default BoutonSuppression;