export interface SessionPayload {
    userId: string; // Identifiant de l'utilisateur
/*    email: string; // Email de l'utilisateur
    role: string; // Rôle de l'utilisateur (par exemple, "admin", "user")*/
    expiresAt: Date; // Date d'expiration de la session
    [key: string]: unknown;
}