import React from "react";
import { StockProps } from "@/interfaces/StockProps";
import BouttonModification from "@/components/BouttonModification";
import BoutonSuppression from "@/components/BoutonSuppression";

const GestionStocks: React.FC<StockProps & { onDelete: (stockId: number) => void }> = ({
                                                                                           stockId,
                                                                                           articleReference,
                                                                                           quantite,
                                                                                           seuilMinimum,
                                                                                           reapprovisionnementAuto,
                                                                                           onDelete,
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
                <BouttonModification entityId={stockId} entityType="stock" />
            </div>
            <div className="w-1/6">
                <BoutonSuppression entityId={stockId} entityType="stock" onDelete={onDelete} />
            </div>
        </div>
    );
};

export default GestionStocks;