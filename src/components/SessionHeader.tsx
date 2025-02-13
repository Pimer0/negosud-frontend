import { cookies } from 'next/headers';
import HeaderClient from '@/components/HeaderClient';
import HeaderUser from '@/components/HeaderUser';

const SessionHeader = async () => {
    const cookieStore = await cookies();
    const existingSession = cookieStore.get('session');
    const existingSessionUser = cookieStore.get('sessionUser');

    if (existingSessionUser) {
        return <HeaderUser existingSessionUser={existingSessionUser} />;
    } else if (existingSession) {
        return <HeaderClient existingSession={existingSession} />;
    } else {
        return <HeaderClient existingSession={null} />;
    }
};

export default SessionHeader;
