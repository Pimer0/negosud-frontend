import {fetchWithSessionUser} from "@/lib/fetchWithSession";
import {createSessionUser} from "@/lib/session";

export const loginUtilisateur = async ({email, motDePasse}: { email: string; motDePasse: string }) => {
    try {

        const response = await fetchWithSessionUser('/api/Utilisateur/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                motDePasse: motDePasse
            }),
        });

        // Pass the entire response to createSession
        await createSessionUser(response);

        return response;
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'admin:', error);
        throw error;
    }
};