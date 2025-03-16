import { cookies } from 'next/headers';
import HeaderClient from '@/components/HeaderClient';
import HeaderUser from '@/components/HeaderUser';
import { decrypt } from '@/lib/session';
import { SessionPayload } from '@/interfaces/SessionPayload';

const SessionHeader = async () => {
    const cookieStore = await cookies();
    const existingSession = cookieStore.get('session');
    const existingSessionUser = cookieStore.get('sessionUser');
    const clientIdCookie = cookieStore.get('clientId');
    const clientId = clientIdCookie?.value || '';

    if (existingSessionUser) {
        try {
            const userPayload = await decrypt(existingSessionUser.value) as SessionPayload;
            const expirationTime = userPayload?.exp ? userPayload.exp * 1000 : 0;
            const currentTime = Date.now();

            if (userPayload && expirationTime > currentTime) {
                return <HeaderUser existingSessionUser={existingSessionUser} />;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du token utilisateur:', error);
        }
    }

    if (existingSession) {
        try {
            const clientPayload = await decrypt(existingSession.value) as SessionPayload;
            const expirationTime = clientPayload?.exp ? clientPayload.exp * 1000 : 0;
            const currentTime = Date.now();

            if (clientPayload && expirationTime > currentTime) {
                return <HeaderClient existingSession={existingSession} clientId={clientId} />;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du token client:', error);
        }
    }

    return <HeaderClient existingSession={null} clientId={clientId} />;
};

export default SessionHeader;