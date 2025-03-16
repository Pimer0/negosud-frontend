export interface BoutonSuppressionProps {
    entityId: number;
    entityType: "stock" | "fournisseur" | "utilisateur";
    onDelete: (id: number) => void;
}