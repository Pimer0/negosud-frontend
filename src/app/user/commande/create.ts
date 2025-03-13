'use server'

import { getUserId, getAuthToken } from '@/lib/session'

interface LigneCommande {
    articleId: number;
    quantite: number;
    prixUnitaire: number;
}

interface CommandePayload {
    prix: number;
    utilisateurId?: number;
    fournisseurID: number;
    ligneCommandes: LigneCommande[];
}

export async function createCommande(payload: CommandePayload) {
    try {
        const userId = await getUserId();
        const authToken = await getAuthToken();

        payload.utilisateurId = parseInt(userId);

        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        } else {
            console.warn("Token d'authentification non trouvé dans les cookies");
        }

        const response = await fetch('http://localhost:5141/api/BonCommande/create', {
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