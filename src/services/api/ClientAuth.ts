import axiosInstance from "@/lib/axiosConfig";
            import { clientT } from "@/interfaces/clientT";

            export const createClient = async (client: clientT) => {
                try {
                    const response = await axiosInstance.post('/api/Client/register', {
                        clientId: 0,
                        nom: client.nom,
                        prenom: client.prenom,
                        email: client.email,
                        motDePasse: client.motDePasse,
                        tel: client.tel,
                        acessToken: ""
                    });
                    return response.data;
                } catch (error) {
                    console.error('Erreur lors de la création du client:', error);
                    throw error;
                }
            };

export const loginClient = async ({ email, motDePasse }: { email: string; motDePasse: string }) => {
    try {
        const response = await axiosInstance.post('/api/Client/login', {
            email: email,
            motDePasse: motDePasse
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion du client:', error);
        throw error;
    }
};

export const getClientByEmail = async ({email} : {email: string}) => {
    try {
        const reponse =  await axiosInstance.post('/api/Utilisateur/exist', {email: email});
    return reponse.data;
} catch (error) {
    console.error('Erreur lors de la recuperation du client:', error);
    throw error;
}
}

export const validateCode = async ({ code, email }: { code: string; email: string }) => {
                try {
                    const reponse = await axiosInstance.post('/api/Client/validate-email', {
                        code: code,
                        email: email
                    });
                    return reponse.data;
                } catch (error) {
                    console.error('Erreur lors de la valaidation du code:', error);
                    throw error;
                }

            };