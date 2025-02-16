import React from "react";
import {MdDeleteOutline} from "react-icons/md";

const BoutonSuppression = ({ stockId, onDelete }: { stockId: number, onDelete: (id: number) => void }) => {
    const handleSuppression = async () => {
        try {
            const reponse = await fetch(`http://localhost:5141/api/Stocks/${stockId}`, {
                method: 'DELETE',
            });
            if (reponse.ok) {
                console.log("Stock supprimé avec succès");
                onDelete(stockId);
            } else {
                console.error("Erreur lors de la suppression");
            }
        } catch (e) {
            console.error("Erreur lors de la suppression", e);
        }
    };

    return (
        <div>
            <button onClick={handleSuppression}><MdDeleteOutline size={30}/></button>
        </div>
    );
};

export default BoutonSuppression;
