import axios, { AxiosError, AxiosInstance } from "axios";
import { ApiError } from "@/interfaces/ApiError";


const axiosInstance: AxiosInstance = axios.create({
        baseURL: 'http://localhost:5141',
        timeout: 60000,
        headers: {
            'Content-Type': 'application/json',
        }
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