import { MdNotificationsActive } from "react-icons/md";

const InfoBulle = ({ colorClass, content }: { colorClass: string; content: string }) => {
    return (
        <div className={`border ${colorClass} w-fit h-fit p-4 m-4 flex flex-row gap-3.5 rounded-3xl`}>
            <MdNotificationsActive size={24} />
            <p>{content}</p>
        </div>
    );
}

export default InfoBulle;