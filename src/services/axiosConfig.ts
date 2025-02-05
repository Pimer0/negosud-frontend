import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/interfaces/ApiError';


const axiosInstance: AxiosInstance = axios.create({
    baseURL: "",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Définir les chemins à exclure de l'envoi du token
const excludedPaths = [
    '/login',
    '/register',
    '/confirmemail',
    '/confirmnewpassword',
    '/passwordreset',
    '/passwordresetemail'
];

// Ajouter un intercepteur de requête
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.url) {
            // Vérifier si l'URL ne commence pas par l'un des chemins exclus
            const isExcluded = excludedPaths.some((path) => config.url?.startsWith(path));

            if (!isExcluded) {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        const customError: ApiError = {
            message: error.response?.data?.message || 'Une erreur est survenue',
            status: error.response?.status
        };

        if (error.response) {

            switch (error.response.status) {
                case 401:
                    customError.message = 'Non authentifié';
                    break;
                case 403:
                    customError.message = 'Accès non autorisé'
                    break;
                case 500:
                    customError.message = 'Erreur serveur'
                    break;
            }
        }

        return Promise.reject(customError);
    }
);

export default axiosInstance;