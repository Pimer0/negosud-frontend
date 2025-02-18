export interface BoutonSuppressionProps {
    entityId: number;
    entityType: "stock" | "fournisseur";
    onDelete: (id: number) => void;
}