'use client';

import { useState, useEffect } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { getSession } from "@/lib/session";

const GestionCartShop = ({ articleId, initialQuantite }: { articleId: number; initialQuantite: number }) => {
    const [quantite, setQuantite] = useState(initialQuantite);
    const [clientId, setClientId] = useState<number | null>(null);
    const [panierId, setPanierId] = useState<number | null>(null);
    const [ligneCommandeId, setLigneCommandeId] = useState<number | null>(null);

    useEffect(() => {
        const fetchClientAndPanier = async () => {
            try {
                const session = await getSession();
                if (session?.clientId) {
                    const fetchedClientId = Number(session.clientId);
                    setClientId(fetchedClientId);

                    const response = await fetch(`http://localhost:5141/api/Panier/${fetchedClientId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data?.id) {
                            setPanierId(data.id);

                            // Trouver la ligne de commande associée à l'article
                            const existingLigne = data.ligneCommandes.find((ligne: any) => ligne.articleId === articleId);
                            if (existingLigne) {
                                setLigneCommandeId(existingLigne.ligneCommandeId);
                                setQuantite(existingLigne.quantite);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };

        fetchClientAndPanier();
    }, []);

    const updateOrCreatePanier = async (newQuantite: number) => {
        if (!clientId) return;

        try {
            const endpoint = panierId ? 'update' : 'create';
            const method = panierId ? 'PUT' : 'POST';

            const response = await fetch(`http://localhost:5141/api/Panier/${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commandId: panierId || 0,
                    clientId: clientId,
                    ligneCommandes: [
                        {
                            ligneCommandeId: ligneCommandeId ?? 0, // Utiliser l'ID existant ou 0 pour une nouvelle ligne
                            articleId: articleId,
                            quantite: newQuantite,
                        },
                    ],
                }),
            });

            if (!response.ok) throw new Error(`Erreur lors de la mise à jour du panier (${endpoint})`);

            const data = await response.json();

            // Si une nouvelle ligne a été créée, on met à jour l'ID
            if (!ligneCommandeId && data.ligneCommandes) {
                const newLigne = data.ligneCommandes.find((ligne: any) => ligne.articleId === articleId);
                if (newLigne) setLigneCommandeId(newLigne.ligneCommandeId);
            }
            console.log(data);
            setPanierId(data.id);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const handleIncrement = () => {
        const newQuantite = quantite + 1;
        setQuantite(newQuantite);
        updateOrCreatePanier(newQuantite);

    };

    const handleDecrement = () => {
        if (quantite > 0) {
            const newQuantite = quantite - 1;
            setQuantite(newQuantite);
            updateOrCreatePanier(newQuantite);
        }
    };

    return (
        <div className="flex flex-row gap-[4.25rem] m-6">
            <button onClick={handleDecrement}><IoIosRemove size={20} /></button>
            <p>{quantite}</p>
            <button onClick={handleIncrement}><IoIosAdd size={20} /></button>
        </div>
    );
};

export default GestionCartShop;
