import React from "react";
import {ProduitProps} from "@/interfaces/ProduitProps";
import Image from "next/image";

const Produit: React.FC<ProduitProps> = ({libelle, famille, prix}) => {
    return (
        <div>

            <div>
                <Image src={"/vin.png"} alt={"Vin"}/>
            </div>
            <div>
                <p>{libelle}</p>
                <p>{famille}</p>
                <p>{prix}</p>
            </div>
        </div>

    )
}
export default Produit;