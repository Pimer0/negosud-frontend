'use client';

import Link from 'next/link';
import { deleteSession } from "@/lib/session";
import { useRouter } from 'next/navigation';

export default function ButtonDeconnexion() {
    const router = useRouter();

    const handleDeco = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        try {
            deleteSession();
            router.push('/');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Link href={'/'} onClick={handleDeco}>Deconnexion</Link>
    );
}