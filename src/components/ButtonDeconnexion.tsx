'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {logoutClient} from "@/services/api/ClientAuth";

export default function ButtonDeconnexion() {
    const router = useRouter();

    const handleDeco = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        try {
            logoutClient();
            router.push('/');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Link href={'/'} onClick={handleDeco}>Deconnexion</Link>
    );
}