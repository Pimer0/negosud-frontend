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
            // si commandId est 0, on essaie d'abord de récupérer un panier existant
            if (!commandId) {
                try {
                    // on vérifie si un panier existe déjà
                    const checkResponse = await fetch(`http://localhost:5141/api/Panier/${clientId}`);
                    const checkData = await checkResponse.json();
                    
                    if (checkData.success && checkData.data?.commandeId) {
                        // si un panier existe on utilise son id
                        setCommandId(checkData.data.commandeId);
                        
                        // mise à jour avec le panier existant
                        const updateBody = {
                            commandId: checkData.data.commandeId,
                            clientId,
                            articleId,
                            newQuantite,
                            ligneCommandeId
                        };
                        
                        const response = await fetch(`http://localhost:5141/api/Panier/update`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updateBody),
                        });
                        
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(`Erreur lors de la mise à jour du panier: ${errorData.message}`);
                        }
                        
                        const responseData = await response.json();
                        
                        // Mettre à jour le panier virtuel
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
                        return;
                    }
                    
                    // aucun panier n'existe, on en crée un nouveau
                    const createBody = {
                        clientId,
                        articleId,
                        newQuantite,
                    };
                    
                    const createResponse = await fetch(`http://localhost:5141/api/Panier/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(createBody),
                    });
                    
                    if (!createResponse.ok) {
                        const errorData = await createResponse.json();
                        throw new Error(`Erreur lors de la création du panier: ${errorData.message}`);
                    }
                    
                    const createData = await createResponse.json();
                    
                    if (createData.success && createData.data?.commandeId) {
                        setCommandId(createData.data.commandeId);
                        
                        // mise à jour le panier virtuel
                        const newPanier = createData.data.ligneCommandes.reduce((acc: { [key: number]: { quantite: number; ligneCommandeId: number } }, ligne: LigneCommande) => {
                            if (ligne.article) {
                                acc[ligne.article.articleId] = {
                                    quantite: ligne.quantite,
                                    ligneCommandeId: ligne.ligneCommandeId
                                };
                            }
                            return acc;
                        }, {});
                        
                        setPanierVirtuel(newPanier);
                    }
                } catch (error) {
                    console.error("Erreur lors de la gestion du panier:", error);
                    setError(`${error instanceof Error ? error.message : "Erreur inconnue lors de la gestion du panier"}`);
                    return;
                }
            } else {
                // si commandId existe déjà, on met à jour
                const requestBody = {
                    commandId,
                    clientId,
                    articleId,
                    newQuantite,
                    ligneCommandeId
                };
    
                const response = await fetch(`http://localhost:5141/api/Panier/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erreur lors de la synchronisation du panier: ${errorData.message}`);
                }
    
                const responseData = await response.json();
                
                // mise à jour du panier virtuel
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
            }
        } catch (error) {
            console.error("Erreur lors de la synchronisation du panier:", error);
            setError(`Erreur lors de la synchronisation du panier: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
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
