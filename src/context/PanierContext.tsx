'use client'
import { createContext, useContext, useEffect, useState } from "react";

// définition du type du contexte (pour éviter les erreurs de typages)
interface PanierContextType {
    panierCount: number;
    updatePanier: () => void;
}

// création du contexte
const PanierContext = createContext<PanierContextType | undefined>(undefined);

// hook pour utiliser le contexte
export const usePanierContext = () => {
    const context = useContext(PanierContext);
    if (!context) {
        throw new Error("usePanierContext must be used within a PanierProvider");
    }
    return context;
};

// le provider qui va encapsule l'application
export const PanierProvider = ({ children }: { children: React.ReactNode }) => {
    const [panierCount, setPanierCount] = useState(0);

    // Fonction pour mettre à jour le panier
    const updatePanier = () => {
        const panier = localStorage.getItem("panierVirtuel");
        if (panier) {
            const parsedPanier: { [key: string]: PanierItem } = JSON.parse(panier);
            const totalQuantite = Object.values(parsedPanier).reduce((total, item) => total + item.quantite, 0);
            setPanierCount(totalQuantite);
        } else {
            setPanierCount(0);
        }
    };

    // chargement des données au montage
    useEffect(() => {
        updatePanier();
    }, []);

    return (
        <PanierContext.Provider value={{ panierCount, updatePanier }}>
            {children}
        </PanierContext.Provider>
    );
};
