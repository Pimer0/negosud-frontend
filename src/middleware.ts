import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import type { NextRequest } from 'next/server';
import { SessionPayload } from '@/interfaces/SessionPayload';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Exclure la route /user/login et /user/code
    if (pathname === '/user/login' || '/user/code') {
        return NextResponse.next();
    }

    const session = request.cookies.get('session')?.value;
    const sessionUser = request.cookies.get('sessionUser')?.value;

    let payload: SessionPayload | null = null;
    let isAdmin = false;

    if (session) {
        payload = await decrypt(session) as SessionPayload;
    } else if (sessionUser) {
        payload = await decrypt(sessionUser) as SessionPayload;
        isAdmin = true;
    }

    if (!payload || new Date(payload.exp * 1000) < new Date()) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        return NextResponse.redirect(new URL(isAdmin ? '/user/code' : '/client/login', request.url));
    }

    // Ajouter les informations de l'utilisateur à la requête
    request.headers.set('userId', payload.userId);
    // @ts-expect-error on lui passe quand meme date
    request.headers.set('DateExp', payload.expiresAt);
    /*    request.headers.set('email', payload.email);
    request.headers.set('role', payload.role);*/

    return NextResponse.next();
}

// Appliquer le middleware à certaines routes
export const config = {
    matcher: ['/profile', '/shop', '/user/:path*'], // Protéger ces routes
};