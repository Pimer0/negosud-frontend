'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutClient } from "@/services/api/ClientAuth";
import { logoutUser } from "@/lib/session";
import { useSession } from "@/context/SessionProvider";

export default function ButtonDeconnexion() {
    const router = useRouter();
    const existingSessionUser = useSession();

    console.log(existingSessionUser);
    
    const handleDeco = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        try {
            if (existingSessionUser/*?.UserId*/ ) {
                await logoutUser();
            } else {
                await logoutClient();
            }
            router.push('/');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Link href={'/'} onClick={handleDeco}>Deconnexion</Link>
    );
}
