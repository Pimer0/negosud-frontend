'use server'

import { getAuthToken } from '@/lib/session'


export async function fetchAllArticlesByFournisseur(fournisseurId : number) {
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

        const response = await fetch(`http://localhost:5141/api/Article/fournisseur/${fournisseurId}`,{
            method: 'GET',
            headers,
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error creating commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}
export async function fetchCommandeById(commandeId : number) {
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

        const response = await fetch(`http://localhost:5141/api/BonCommande/${commandeId}`, {
            method: 'GET',
            headers,
        });

        return await response.json();
    } catch (error) {
        console.error('Error creating commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}
export async function fetchAllCommande() {
    try {
        const authToken = await getAuthToken();
        console.log(authToken);
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        } else {
            console.warn("Token d'authentification non trouvé dans les cookies");
        }

        const response = await fetch(`http://localhost:5141/api/BonCommande`, {
            method: 'GET',
            headers,
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating commande:', error);
        return {success: false, message: 'Erreur serveur'};
    }
}