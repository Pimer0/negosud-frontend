import React from "react";
import { FournisseurProps } from "@/interfaces/FournisseurProps";

const GestionFournisseur: React.FC<FournisseurProps> = ({
                                                            nom,
                                                            raisonSociale,
                                                            email,
                                                            tel,
                                                            adresse
                                                        }) => {
    return (
        <div className={"flex flex-row gap-8"}>
            <p className="w-1/6">{nom}</p>
            <p className="w-1/6">{raisonSociale}</p>
            <p className="w-1/6">{email}</p>
            <p className="w-1/6">{tel}</p>
            <p className="w-1/6">{adresse || "N/A"}</p>
            <p className="w-1/6">Édition</p>
        </div>
    );
};

export default GestionFournisseur;
