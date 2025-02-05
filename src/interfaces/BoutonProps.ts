export interface BoutonProps {
    text: string;
    colorClass?: string;
    hoverColorClass?: string;
    widthClass?: string;
    onClick?: () => void;
    childrenIcon?: React.ReactNode;
}