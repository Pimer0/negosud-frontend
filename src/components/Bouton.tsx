import React from "react";
import {BoutonProps} from "@/interfaces/BoutonProps";

const Bouton: React.FC<BoutonProps> = ({
                                           text,
                                           colorClass = "bg-white",
                                           hoverColorClass = "hover:bg-[#1E4147] hover:text-white",
                                           widthClass = "w-full",
                                           onClick,
    childrenIcon
                                       }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded font-bold transition duration-300 ease-in-out ${colorClass} ${hoverColorClass} ${widthClass} flex text-center justify-center`}
        >
            {text}
            {childrenIcon}
        </button>
    );
};

export default Bouton;