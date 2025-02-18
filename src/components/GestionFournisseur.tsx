import React from "react";
import { FournisseurProps } from "@/interfaces/FournisseurProps";
import BouttonModification from "@/components/BouttonModification";
import BoutonSuppression from "@/components/BoutonSuppression";

const GestionFournisseur: React.FC<FournisseurProps & { onDelete: (id: number) => void }> = ({
                                                                                                 fournisseurId,
                                                                                                 nom,
                                                                                                 raisonSociale,
                                                                                                 email,
                                                                                                 tel,
                                                                                                 adresse,
                                                                                                 onDelete,
                                                                                             }) => {
    return (
        <div className="flex flex-row min-h-[60px] items-center border-b border-gray-200">
            <p className="w-1/7 px-2 break-words overflow-hidden">{nom}</p>
            <p className="w-1/7 px-2 break-words overflow-hidden">{raisonSociale}</p>
            <p className="w-1/7 px-2 break-words overflow-hidden">{email}</p>
            <p className="w-1/7 px-2 break-words overflow-hidden">{tel}</p>
            <p className="w-1/7 px-2 break-words overflow-hidden">{adresse || "N/A"}</p>
            <div className="w-1/7 px-2 flex items-center">
                <BouttonModification entityId={fournisseurId} entityType="fournisseur" />
            </div>
            <div className="w-1/7 px-2 flex items-center">
                <BoutonSuppression entityId={fournisseurId} entityType="fournisseur" onDelete={onDelete} />
            </div>
        </div>
    );
};

export default GestionFournisseur;