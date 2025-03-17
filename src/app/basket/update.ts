'use server'

import { getClientId, getSession } from '@/lib/session'

interface PanierPayload {
    commandId:number,
    clientId:number,
    articleId:number,
    newQuantite:number,
    ligneCommandeId:number|null|undefined,
}

export async function updatePanier(payload: PanierPayload) {
    try {
        const clientId = await getClientId();
        const authToken = await getSession();

        payload.clientId = parseInt(clientId);
        

        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken.token}`;
        } else {
            console.warn("Token d'authentification non trouvé dans les cookies");
        }
        console.log(headers);

        const response = await fetch("http://localhost:5141/api/Panier/update", {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}