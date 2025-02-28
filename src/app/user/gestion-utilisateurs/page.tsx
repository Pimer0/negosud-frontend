import EncartForm from "@/components/EncartForm";
import {FournisseurProps} from "@/interfaces/FournisseurProps";
import GestionFournisseur from "@/components/GestionFournisseur";
import React from "react";

export default function GestionUtilisateurs() {
    return (
        <div>
            <EncartForm titre={"Gestion des utilisateurs"}>
                <div>
                    <div className="mb-8">
                        <div className="mb-4 font-bold border-b border-gray-400">
                            <h3 className="font-extrabold">Utilisateurs</h3>
                        </div>
                        {fournisseurs.map((fournisseur: FournisseurProps, index) => (
                            <GestionFournisseur
                                key={index}
                                fournisseurId={fournisseur.fournisseurId}
                                nom={fournisseur.nom}
                                raisonSociale={fournisseur.raisonSociale}
                                email={fournisseur.email}
                                tel={fournisseur.tel}
                                adresse={fournisseur.adresse}
                                onDelete={handleDeleteFournisseur}
                            />
                        ))}
                    </div>
            </EncartForm>
        </div>
    )
}