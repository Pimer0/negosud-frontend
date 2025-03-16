export interface ResponseData {
    data?: {
        clientId?: string;
        acessToken?: string;
    };
    tokenJWT?: string;
}

export interface ResponseDataUser {
    data?: {
        id?: string;
        roleId?: string;
    };
    tokenJWT?: string;
}

export interface sessionUser {
    token?: string | undefined;
    UserId?: string | undefined;
}
