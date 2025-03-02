import EncartForm from "@/components/EncartForm";
import {FournisseurProps} from "@/interfaces/FournisseurProps";
import GestionFournisseur from "@/components/GestionFournisseur";
import Bouton from "@/components/Bouton";
import {IoMdAdd} from "react-icons/io";
import {FaCartPlus} from "react-icons/fa6";
import React from "react";
import {useRouter} from "next/navigation";

export default function GestionInventaire() {

    const router = useRouter();
    return (
        <div>
            <EncartForm titre={"Inventaire"}>
                <div>
                    <div className="mb-8">
                        <div className="mb-4 font-bold border-b border-gray-400">
                            <h3 className="font-extrabold">Fournisseurs</h3>
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
                    <div className={"flex flex-row justify-center gap-4 mt-8"}>
                        <Bouton
                            text={"Retour"}
                            childrenIcon={<IoMdAdd size={25}/>}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                            onClick={() => router.back()}
                        />
                        <Bouton
                            text={"Enregistrer"}
                            childrenIcon={<FaCartPlus style={{ marginLeft: "1rem" }} size={25} />}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        />
                    </div>
                </div>
                </EncartForm>
        </div>
    )
}