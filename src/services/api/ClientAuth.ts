import axiosInstance from "@/lib/axiosConfig";
            import { clientT } from "@/interfaces/clientT";

            export const createUser = async (client: clientT) => {
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