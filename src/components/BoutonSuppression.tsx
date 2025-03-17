import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BoutonSuppressionProps } from "@/interfaces/BoutonSuppressionProps";


const BoutonSuppression = ({ entityId, entityType, onDelete }: BoutonSuppressionProps) => {
    const handleSuppression = async () => {
        let endpoint = "";

        switch (entityType) {
            case "stock":
                endpoint = `http://localhost:5141/api/Stocks/${entityId}`;
                break;
            case "fournisseur":
                endpoint = `http://localhost:5141/api/Fournisseur/${entityId}`;
                break;
            case "utilisateur":
                endpoint = `http://localhost:5141/api/Utilisateur/${entityId}`;
                break;
            default:
                console.error("Type d'entité non reconnu");
                return;
        }

        try {
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