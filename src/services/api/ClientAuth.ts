import { clientT } from "@/interfaces/clientT";
import { createSession, deleteSession } from "@/lib/session";
import { fetchWithSession } from "@/lib/fetchWithSession";

export const createClient = async (client: clientT) => {
    try {
        const response = await fetchWithSession('/api/Client/register', {
            method: 'POST',
            body: JSON.stringify({
                clientId: 0,
                nom: client.nom,
                prenom: client.prenom,
                email: client.email,
                motDePasse: client.motDePasse,
                tel: client.tel,
                acessToken: ""
            }),
        });

        await createSession(response);

        return response;
    } catch (error) {
        console.error('Erreur lors de la création du client:', error);
        throw error;
    }
};

// Connexion d'un client et création d'une session
export const loginClient = async ({ email, motDePasse }: { email: string; motDePasse: string }) => {
    try {
        const response = await fetchWithSession('/api/Client/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                motDePasse: motDePasse
            }),
        });

        // Pass the entire response to createSession
        await createSession(response);

        return response;
    } catch (error) {
        console.error('Erreur lors de la connexion du client:', error);
        throw error;
    }
};

// Récupérer un client par email
export const getClientByEmail = async ({ email }: { email: string }) => {
    try {
        const response = await fetchWithSession('/api/Client/exist', {
            method: 'POST',
            body: JSON.stringify({ email: email }),
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération du client:', error);
        throw error;
    }
};

// Valider un code (protégé par session)
export const validateCode = async ({ code, email }: { code: string; email: string }) => {
    try {
        const response = await fetchWithSession('/api/Client/validate-email', {
            method: 'POST',
            body: JSON.stringify({
                code: code,
                email: email
            }),
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la validation du code:', error);
        throw error;
    }
};

// Déconnexion d'un client
export const logoutClient = async () => {
    try {
        // Supprimer la session
        await deleteSession();

        // Rediriger l'utilisateur vers la page de connexion
        window.location.href = '/client/login'; // Redirection côté client
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        throw error;
    }
};