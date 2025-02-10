export interface ResponseData {
    data?: {
        clientId?: string;
        acessToken?: string;
    };
    tokenJWT?: string;
}