import React from "react";
import { StockProps } from "@/interfaces/StockProps";
import BoutonSuppression from "@/components/BoutonSuppression";

const GestionStocks: React.FC<StockProps & { onDelete: (stockId: number) => void }> = ({
                                                                                           stockId,
                                                                                           articleReference,
                                                                                           quantite,
                                                                                           seuilMinimum,
                                                                                           reapprovisionnementAuto,
                                                                                           onDelete,
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
                    className={"w-fit h-fit m-0"}
                />
            </div>
            <div className="w-1/6">
                <BoutonSuppression stockId={stockId} onDelete={onDelete} />
            </div>
            <div className="w-1/6">{children}</div>
        </div>
    );
};

export default GestionStocks;
