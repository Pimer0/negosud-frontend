import Link from 'next/link';
import Image from 'next/image';
import { liensHeader } from '@/Utils/liensHeader';
import { FiShoppingCart } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import ButtonDeconnexion from '@/components/ButtonDeconnexion';
import PanierCount from './PanierCount';
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";

const HeaderClient: React.FC<{ existingSession: RequestCookie | null, style?: string }> = ({ existingSession, style = 'flex row text-[#1E4147] active:underline active:underline-offset-4 focus:underline focus:underline-offset-4 hover:underline hover:underline-offset-4' }) => {
    return (
        <header className={'flex items-center justify-between p-4'}>
            <Image className={'left-0'} src="/Nsud.png" alt="logo" width={80} height={20} />
            <div className={'flex-grow flex justify-center gap-5'}>
                {liensHeader.map((lien, index) => (
                    <Link className={style} key={index} href={lien.pathname}>
                        {lien.text}
                    </Link>
                ))}
                {!existingSession && <Link className={style} href={"/client/login"}>Connexion</Link>}
                {existingSession && <ButtonDeconnexion />}
            </div>
            <div className={'flex justify-center gap-5'}>
                <Link className={style} href={'/panier'}>
                    <FiShoppingCart color={'#1E4147'} style={{ marginRight: '0.5rem' }} />
                    Panier <PanierCount />
                </Link>
                <Link className={style} href={'/compte'}>
                    <FaRegUser color={'#1E4147'} style={{ marginRight: '0.5rem' }} />
                    Compte
                </Link>
            </div>
        </header>
    );
};

export default HeaderClient;
