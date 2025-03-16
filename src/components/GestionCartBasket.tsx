import React from 'react';
import { IoIosAdd, IoIosRemove, IoIosTrash } from "react-icons/io";
import usePanier from "@/hooks/UsePanier";
import { usePanierContext } from "@/context/PanierContext";
import { GestionCartShopProps } from '@/interfaces/GestionCartShopProps';

const GestionCartBasket: React.FC<GestionCartShopProps & { onQuantityChange: (articleId: number, newQuantite: number) => void; onRemove: (articleId: number) => void }> = ({
    articleId,
    initialQuantite,
    ligneCommandeId,
    onQuantityChange,
    onRemove,
}) => {
    const { quantite, setQuantite, updatePanierVirtuel, error, isLoading } = usePanier(articleId, initialQuantite);
    const { updatePanier } = usePanierContext(); // le context pour mettre à jour le chiffre dans le header 

    const handleIncrement = async () => {
        const newQuantite = quantite + 1;
        setQuantite(newQuantite);
        await updatePanierVirtuel(newQuantite, ligneCommandeId);
        onQuantityChange(articleId, newQuantite);
        updatePanier();
    };

    const handleDecrement = async () => {
        if (quantite > 1) { 
            const newQuantite = quantite - 1;
            setQuantite(newQuantite);
            await updatePanierVirtuel(newQuantite, ligneCommandeId);
            updatePanier();
            onQuantityChange(articleId, newQuantite);
        }
    };
    
    const handleRemove = async () => {
        await updatePanierVirtuel(0, ligneCommandeId);
        updatePanier();
        onRemove(articleId); 
    };

    return (
        <div className="flex flex-col items-center gap-[1rem] m-3">
            <button onClick={handleIncrement} disabled={isLoading}>
                <IoIosAdd size={20} />
            </button>
            <p>{quantite}</p>
            <button onClick={handleDecrement} disabled={isLoading}>
                <IoIosRemove size={20} />
            </button>
            <button onClick={handleRemove} disabled={isLoading} className="text-red-800">
                <IoIosTrash size={20} />
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default GestionCartBasket;
