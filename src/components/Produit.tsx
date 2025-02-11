import React from "react";
import {ProduitProps} from "@/interfaces/ProduitProps";
import Image from "next/image";


const Produit: React.FC<ProduitProps> = ({libelle, famille, prix, children}) => {
    return (
        <div>
            <div className={"flex-row flex gap-3"}>

                <div className={"bg-white rounded-lg"}>
                    <Image width={239} height={239} src={"/vin.png"} alt={"Vin"}/>
                </div>
                <div>
                    <p className={"font-bold"}>{libelle}</p>
                    <p>{famille}</p>
                    <p className={"font-bold"}>{prix}€</p>
                </div>
            </div>
            {children}
        </div>

    )
}
export default Produit;