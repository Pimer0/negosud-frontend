import React from "react";
import { StockProps } from "@/interfaces/StockProps";

const GestionStocks: React.FC<StockProps> = ({
                                                 stockId,
                                                 articleReference,
                                                 quantite,
                                                 seuilMinimum,
                                                 reapprovisionnementAuto,
                                                 children
                                             }) => {
    return (
        <div className={"flex flex-row gap-8"}>
            <p className="w-1/6">{stockId}</p>
            <p className="w-1/6">{articleReference || "N/A"}</p>
            <p className="w-1/6">{quantite}</p>
            <p className="w-1/6">{seuilMinimum}</p>
            <div className="w-1/6">
                <input
                    type="checkbox"
                    checked={reapprovisionnementAuto}
                    readOnly
                    style={{ transform: "scale(1.5)" }}
                />
            </div>
            <div className="w-1/6">{children}</div>
        </div>
    );
};

export default GestionStocks;
