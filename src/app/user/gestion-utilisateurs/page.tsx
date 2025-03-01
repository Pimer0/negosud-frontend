'use client';
import EncartForm from "@/components/EncartForm";
import React, { useEffect } from "react";
import { UtilisateurProps } from "@/interfaces/UtilisateurProps";
import { useRouter } from "next/navigation";
import GestionUtilisateur from "@/components/GestionUtilisateur";
import Bouton from "@/components/Bouton";
import { IoMdAdd } from "react-icons/io";


export default function GestionUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = React.useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUtilisateurs = async () => {
            try {
                const response = await fetch("http://localhost:5141/api/Utilisateurs");
                const data = await response.json();
                if (data.success) {
                    setUtilisateurs(data.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
            }
        };
        fetchUtilisateurs();
    }, []);

    const handleDeleteUtilisateur = (id: number) => {
        setUtilisateurs((prevUtilisateurs) => prevUtilisateurs.filter((utilisateur: UtilisateurProps) => utilisateur.id !== id));
    };

    return (
        <div>
            <EncartForm titre={"Gestion des utilisateurs"}>
                <div>
                    <div className="mb-8">
                        <div className="mb-4 font-bold border-b border-gray-400">
                            <h3 className="font-extrabold">Utilisateurs</h3>
                        </div>
                        {utilisateurs.map((utilisateur: UtilisateurProps, index) => (
                            <GestionUtilisateur
                                key={index}
                                nom={utilisateur.nom}
                                prenom={utilisateur.prenom}
                                email={utilisateur.email}
                                roleId={utilisateur.roleId}
                                onDelete={handleDeleteUtilisateur}
                                id={0}
                                telephone={""}
                                roleNom={""} />
                        ))}
                    </div>
                    <div className={"flex flex-row justify-center gap-4 mt-8"}>
                        <Bouton
                            text={"Créer"}
                            childrenIcon={<IoMdAdd size={25} />}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                            onClick={() => router.push("/user/ajout-utilisateurs")}
                        />
                        <Bouton
                            text={"Retour"}
                            colorClass={"bg-[#1E4147] text-white"}
                            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                            onClick={() => router.back()}
                        />
                    </div>
                </div>
            </EncartForm>
        </div>
    );
}