'use server'

import { getAuthToken } from '@/lib/session'

export async function deleteCommandeLine(ligneBonCommandeId : number) {
    try {
        const authToken = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        } else {
            console.warn("Token d'authentification non trouvé dans les cookies");
        }

        const response = await fetch(`http://localhost:5141/api/BonCommande/delete/ligne-commande/${ligneBonCommandeId}`, {
            method: 'DELETE',
            headers,

        });

        return await response.json();
    } catch (error) {
        console.error('Error creating commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}