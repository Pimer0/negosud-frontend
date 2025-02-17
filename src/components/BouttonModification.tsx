import React from "react";
import { FaPen } from "react-icons/fa";
import { useRouter } from "next/navigation";

const BouttonModification = ({ fournisseurId }: { fournisseurId: number }) => {
    const router = useRouter();

    const handleModification = () => {
        // Rediriger vers la page de modification avec l'ID du fournisseur dans l'URL
        router.push(`/user/modification-fournisseur/${fournisseurId}`);
    };

    return (
        <div>
            <button onClick={handleModification}><FaPen size={30} /></button>
        </div>
    );
};

export default BouttonModification;