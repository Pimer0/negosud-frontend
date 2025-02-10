'use server'
import { cookies } from 'next/headers';

export const fetchWithSession = async (url: string, options: RequestInit = {}) => {
    const cookieStore =await  cookies();
    const session = cookieStore.get('session')?.value;

    const headers = {
        'Content-Type': 'application/json',
        ...(session && { Authorization: `Bearer ${session}` }), // Ajoute le token JWT si une session existe
        ...options.headers,
    };

    const response = await fetch(`http://localhost:5141${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
    }

    return response.json();
};