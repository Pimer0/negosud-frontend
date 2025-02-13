'use client'

import { useEffect, useState } from 'react';
import { getSessionUser } from '@/lib/session';

interface SessionUser {
    token?: string;
    UserId?: string;
}

export const useSessionUser = () => {
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

    useEffect(() => {
        const fetchSessionUser = async () => {
            const session = await getSessionUser();
            setSessionUser(session);
        };

        fetchSessionUser();
    }, []);

    return sessionUser;
};