import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import type { NextRequest } from 'next/server';
import { SessionPayload } from '@/interfaces/SessionPayload';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const payload = await decrypt(session) as SessionPayload;

    if (!payload) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Ajouter les informations de l'utilisateur à la requête
    request.headers.set('userId', payload.userId);
    request.headers.set('DateExp', payload.expiresAt.toDateString());
    /*    request.headers.set('email', payload.email);
    request.headers.set('role', payload.role);*/

    return NextResponse.next();
}

// Appliquer le middleware à certaines routes
export const config = {
    matcher: ['/dashboard', '/profile', '/shop'], // Protéger ces routes
};