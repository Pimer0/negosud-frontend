'use server'

import { getClientId, getSession } from '@/lib/session'

interface PanierPayload {
    clientId:number,
    articleId:number,
    newQuantite:number,
}

export async function createPanier(payload: PanierPayload) {
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

        const response = await fetch("http://localhost:5141/api/Panier/create", {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('Error creating commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}