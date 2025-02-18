import React from "react";
import { FaPen } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface BouttonModificationProps {
    entityId: number;
    entityType: "stock" | "fournisseur";
}

const BouttonModification = ({ entityId, entityType }: BouttonModificationProps) => {
    const router = useRouter();

    const handleModification = () => {
        // Rediriger vers la page de modification en fonction du type d'entité
        if (entityType === "stock") {
            router.push(`/user/modification-stock/${entityId}`);
        } else if (entityType === "fournisseur") {
            router.push(`/user/modification-fournisseur/${entityId}`);
        }
    };

    return (
        <div>
            <button onClick={handleModification}><FaPen size={20} /></button>
        </div>
    );
};

export default BouttonModification;