'use server'

import { getUserId, getAuthToken } from '@/lib/session'

interface LigneCommande {
    ligneBonCommandeId: number;
    articleId: number;
    quantite: number;
    livree: boolean;
}

interface CommandePayload {
    status?: string;
    ligneCommandes: LigneCommande[];
    utilisateurId?: number;
}

export async function updateBonCommande(commandeId: number, payload: CommandePayload) {
    try {
        const userId = await getUserId();
        const authToken = await getAuthToken();

        payload.utilisateurId = userId ? parseInt(userId) : undefined;

        console.log(payload);
        

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };


        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        } else {
            console.warn("Token d'authentification non trouvé dans les cookies");
        }

        const response = await fetch(`http://localhost:5141/api/BonCommande/update/${commandeId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('Error updating commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}