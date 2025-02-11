'use client';

import { IoIosAdd, IoIosRemove } from "react-icons/io";
import usePanier from "@/app/hooks/UsePanier"; // Correct the import casing
import { GestionCartShopProps } from '@/interfaces/GestionCartShopProps';

const GestionCartShop: React.FC<GestionCartShopProps> = ({
    articleId,
    initialQuantite,
    ligneCommandeId
}) => {
    const { quantite, setQuantite, updatePanierVirtuel, error, isLoading } = usePanier(articleId, initialQuantite);

    const handleIncrement = async () => {
        const newQuantite = quantite + 1;
        setQuantite(newQuantite);
        await updatePanierVirtuel(newQuantite, ligneCommandeId);
    };

    const handleDecrement = async () => {
        if (quantite > 0) {
            const newQuantite = quantite - 1;
            setQuantite(newQuantite);
            await updatePanierVirtuel(newQuantite, ligneCommandeId);
        }
    };

    return (
        <div className="flex flex-row gap-[4.25rem] m-6">
            <button onClick={handleDecrement} disabled={isLoading}>
                <IoIosRemove size={20} />
            </button>
            <p>{quantite}</p>
            <button onClick={handleIncrement} disabled={isLoading}>
                <IoIosAdd size={20} />
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {isLoading && <p>Chargement...</p>}
        </div>
    );
};

export default GestionCartShop;