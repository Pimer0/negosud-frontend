import {ReactNode} from "react";

export interface StockProps {
    stockId : number,
    articleReference: null,
    quantite: number,
    seuilMinimum: number,
    reapprovisionnementAuto: boolean,
    children?: ReactNode
}