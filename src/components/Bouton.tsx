import React from "react";
import {BoutonProps} from "@/interfaces/BoutonProps";

const Bouton: React.FC<BoutonProps> = ({
                                           text,
                                           colorClass = "bg-white",
                                           hoverColorClass = "hover:bg-[#1E4147] hover:text-white",
                                           widthClass = "w-fit",
                                           onClick,
                                           childrenIcon,
                                           customType
                                       }) => {
    return (
        <button
type={customType}
            onClick={onClick}
            className={`px-4 py-2 rounded font-bold transition duration-300 ease-in-out ${colorClass} ${hoverColorClass} ${widthClass} flex text-center justify-center border border-[#1E4147]`}
        >
            {text}
            {childrenIcon}
        </button>
    );
};

export default Bouton;