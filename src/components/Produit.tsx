import React from "react";
import {ProduitProps} from "@/interfaces/ProduitProps";
import Image from "next/image";


const Produit: React.FC<ProduitProps> = ({libelle, famille, prix, children, img}) => {
    return (
        <div>
            <div className={"flex-row flex gap-3"}>

                <div className={"bg-white rounded-lg"}>
                    <Image width={239} height={239} src={img} alt={"Vin"}/>
                </div>
                <div>
                    <p className={"font-bold"}>{libelle}</p>
                    <p>{famille.nom ?? "Inconnu"}</p>
                    <p className={"font-bold"}>{prix}€</p>
                </div>
            </div>
            {children}
        </div>

    )
}
export default Produit;