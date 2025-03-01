import BouttonModification from "@/components/BouttonModification";
            import BoutonSuppression from "@/components/BoutonSuppression";
            import React from "react";
            import { UtilisateurProps } from "@/interfaces/UtilisateurProps";

            const GestionUtilisateur: React.FC<UtilisateurProps & { onDelete: (id: number) => void }> = ({
                nom, prenom, email, roleId, id, onDelete
            }) => {
                return (
                    <div className="flex flex-row min-h-[60px] items-center border-b border-gray-200">
                        <p className="w-1/7 px-2 break-words overflow-hidden">{nom}</p>
                        <p className="w-1/7 px-2 break-words overflow-hidden">{prenom}</p>
                        <p className="w-1/7 px-2 break-words overflow-hidden">{email}</p>
                        <p className="w-1/7 px-2 break-words overflow-hidden">{roleId}</p>
                        <div className="w-1/7 px-2 flex items-center">
                            <BouttonModification entityId={id} entityType="utilisateur" />
                        </div>
                        <div className="w-1/7 px-2 flex items-center">
                            <BoutonSuppression entityId={id} entityType="utilisateur" onDelete={onDelete} />
                        </div>
                    </div>
                );
            };

            export default GestionUtilisateur;