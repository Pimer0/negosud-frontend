import React from "react";
import { FaPen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {BouttonModificationProps} from "@/interfaces/BouttonModificationProps";



const BouttonModification = ({ entityId, entityType }: BouttonModificationProps) => {
    const router = useRouter();

    const handleModification = () => {
        // Rediriger vers la page de modification en fonction du type d'entité
        if (entityType === "stock") {
            router.push(`/user/modification-stock/${entityId}`);
        } else if (entityType === "fournisseur") {
            router.push(`/user/modification-fournisseur/${entityId}`);
        }
        else if (entityType ==='utilisateur') {
            router.push(`/user/modification-utilisateur/${entityId}`);
        }
    };

    return (
        <div>
            <button onClick={handleModification}><FaPen size={20} /></button>
        </div>
    );
};

export default BouttonModification;