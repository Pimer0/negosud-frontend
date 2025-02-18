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
        <div className={"flex flex-row gap-8"}>
            <p className="w-1/6">{nom}</p>
            <p className="w-1/6">{raisonSociale}</p>
            <p className="w-1/6">{email}</p>
            <p className="w-1/6">{tel}</p>
            <p className="w-1/6">{adresse || "N/A"}</p>
            <div className="w-1/6">
                <BouttonModification entityId={fournisseurId} entityType="fournisseur" />
            </div>
            <div className="w-1/6">
                <BoutonSuppression entityId={fournisseurId} entityType="fournisseur" onDelete={onDelete} />
            </div>
        </div>
    );
};

export default GestionFournisseur;