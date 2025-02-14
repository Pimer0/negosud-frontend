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
        <div className={"flex flex-row gap-9"}>
            <p>{stockId}</p>
            <p>{articleReference || "N/A"}</p>
            <p>{quantite}</p>
            <p>{seuilMinimum}</p>
            <div>

                    <input
                        type="checkbox"
                        checked={reapprovisionnementAuto}
                        readOnly
                        style={{ transform: "scale(1.5)" }}
                    />

            </div>
            <div>{children}</div>
        </div>
    );
};

export default GestionStocks;
