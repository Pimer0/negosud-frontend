import React from "react";
import {BoutonProps} from "@/interfaces/BoutonProps";

const Bouton: React.FC<BoutonProps> = ({
                                           text,
                                           colorClass = "bg-white text-[1E4147]",
                                           hoverColorClass = "hover:bg-[1E4147] hover:text-white",
                                           widthClass = "w-full",
                                           onClick,
                                       }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded font-bold transition duration-300 ease-in-out ${colorClass} ${hoverColorClass} ${widthClass} flex text-center justify-center`}
        >
            {text}
        </button>
    );
};

export default Bouton;