import { useState, useEffect, useCallback } from "react";
import { getSession } from "@/lib/session";

const usePanier = (articleId: number, initialQuantite: number) => {
    const [quantite, setQuantite] = useState(initialQuantite);
    const [commandId, setCommandId] = useState<number>(0);
    const [clientId, setClientId] = useState<number | null>(null);
    const [panierVirtuel, setPanierVirtuel] = useState<{ [key: number]: { quantite: number; ligneCommandeId: number } }>({});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedPanier = localStorage.getItem("panierVirtuel");
        if (storedPanier) {
            setPanierVirtuel(JSON.parse(storedPanier));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("panierVirtuel", JSON.stringify(panierVirtuel));
    }, [panierVirtuel]);

    useEffect(() => {
        if (panierVirtuel[articleId]) {
            setQuantite(panierVirtuel[articleId].quantite);
        }
    }, [panierVirtuel, articleId]);

    const fetchExistingPanier = async (clientId: number) => {
        try {
            const response = await fetch(`http://localhost:5141/api/Panier/${clientId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.data?.commandeId) {
                    const existingPanier = data.data.ligneCommandes.reduce((acc: { [key: number]: { quantite: number; ligneCommandeId: number } }, ligne: LigneCommande) => {
                        acc[ligne.article.articleId] = {
                            quantite: ligne.quantite,
                            ligneCommandeId: ligne.ligneCommandeId
                        };
                        return acc;
                    }, {});
                    setPanierVirtuel(existingPanier);
                    setCommandId(data.data.commandeId);
                } else {
                    setPanierVirtuel({});
                    setCommandId(0);
                }
            } else {
                console.error("Erreur lors de la récupération du panier existant :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du panier existant:", error);
        }
    };

    useEffect(() => {
        const fetchClientIdAndPanier = async () => {
            try {
                const session = await getSession();
                if (session?.clientId) {
                    const clientId = Number(session.clientId);
                    setClientId(clientId);
                    await fetchExistingPanier(clientId);
                }
            } catch (error) {
                handleError(`Erreur lors de la récupération du panier existant: ${error}`);
            }
        };

        fetchClientIdAndPanier();
    }, []);

    const synchroniserPanier = useCallback(async (newQuantite: number, ligneCommandeId?: number | null) => {
        if (!clientId) {
            console.error("Aucun ID client disponible pour synchroniser le panier.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let response = null;
            if (!commandId) {
                const requestBody = {
                    clientId,
                    articleId,
                    newQuantite,
                };

                response = await fetch(`http://localhost:5141/api/Panier/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

            } else {
                const requestBody = {
                commandId,
                clientId,
                articleId,
                newQuantite,
                ligneCommandeId
                };

                response = await fetch(`http://localhost:5141/api/Panier/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur lors de la synchronisation du panier: ${errorData.message}`);
            }

            const responseData = await response.json();
            if (commandId === 0 && responseData.data?.commandeId) {
                setCommandId(responseData.data.commandeId);
            }

            const updatedPanier = responseData.data.ligneCommandes.reduce((acc: { [key: number]: { quantite: number; ligneCommandeId: number } }, ligne: LigneCommande) => {
                if (ligne.article) {
                    acc[ligne.article.articleId] = {
                        quantite: ligne.quantite,
                        ligneCommandeId: ligne.ligneCommandeId
                    };
                }
                return acc;
            }, {});
            setPanierVirtuel(updatedPanier);
        } catch (error) {
            console.error("Erreur lors de la synchronisation du panier:", error);
            setError("Une erreur s'est produite lors de la synchronisation du panier.");
        } finally {
            setIsLoading(false);
        }
    }, [articleId, clientId, commandId]);

    const updatePanierVirtuel = useCallback(async (newQuantite: number, ligneCommandeId?: number | null) => {
        setPanierVirtuel(prev => ({
            ...prev,
            [articleId]: { quantite: newQuantite, ligneCommandeId: ligneCommandeId || prev[articleId]?.ligneCommandeId || 0 }
        }));
        setQuantite(newQuantite);
        await synchroniserPanier(newQuantite, ligneCommandeId);
    }, [articleId, synchroniserPanier]);

    const handleError = (message: string) => {
        console.error(message);
        setError(message);
    };

    return {
        quantite,
        setQuantite,
        updatePanierVirtuel,
        error,
        isLoading,
    };
};

export default usePanier;
