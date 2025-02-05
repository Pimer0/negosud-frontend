import React from "react";
import {EncartProps} from "@/interfaces/EncartProps";

const Encart: React.FC<EncartProps> = ({children, titre, corps}) => {
    return (
        <div className="bg-white rounded p-4">
            <h2 className="text-xl font-bold">{titre}</h2>
            <p>{corps}</p>
            {children}
        </div>
    );
}

export default Encart;