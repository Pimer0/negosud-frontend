export interface GestionStockProps {
    stockId: number;
    articleReference: string;
    libelle: string;
    quantiteActuelle: number;
    seuilMinimum: number;
    reapprovisionnementAuto: boolean;
    onQuantityChange: (stockId: number, newQuantite: number) => void;
}

export interface StockData {
    stockId: number;
    articleReference: string;
    libelle: string;
    quantite: number;
    refLot: string;
    seuilMinimum: number;
    reapprovisionnementAuto: boolean;
}