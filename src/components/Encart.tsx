import React from "react";
import {EncartProps} from "@/interfaces/EncartProps";
import {barlowCondensed} from "@/app/fonts";


const Encart: React.FC<EncartProps> = ({children, titre, corps, customWidth}) => {
    return (
        <div className={`bg-white rounded p-4 m-4 ${customWidth || ''} h-[260px]`}>
            <h2 className={`font-bold ${barlowCondensed.className}`}>{titre}</h2>
            <p>{corps}</p>
            {children}
        </div>
    );
}

export default Encart;