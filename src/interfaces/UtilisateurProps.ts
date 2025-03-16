export interface UtilisateurProps {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    roleId: number;
    role?: string;
    roleNom?: string;
    telephone?: string;
    deleted_at: string;
  }