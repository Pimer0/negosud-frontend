'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSessionUser } from '@/lib/session';

interface SessionUser {
    token?: string;
    UserId?: string;
}

const SessionContext = createContext<SessionUser | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

    useEffect(() => {
        const fetchSessionUser = async () => {
            const session = await getSessionUser();
            setSessionUser(session);
        };

        fetchSessionUser();
    }, []);

    return (
        <SessionContext.Provider value={sessionUser}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    return useContext(SessionContext);
};