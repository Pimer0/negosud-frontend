import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import type { NextRequest } from 'next/server';
import { SessionPayload } from '@/interfaces/SessionPayload';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Cas spécial pour /user/code - toujours accessible
    if (pathname === '/user/code') {
        return NextResponse.next();
    }

    // Vérification pour /user/login
    if (pathname === '/user/login') {
        const hasCookieCode = request.cookies.get('CookieCode')?.value === 'true';
        if (!hasCookieCode) {
            return NextResponse.redirect(new URL('/user/code', request.url));
        }
        return NextResponse.next();
    }

    // Pour toutes les autres routes protégées, vérifier l'authentification
    const session = request.cookies.get('session')?.value;
    const sessionUser = request.cookies.get('sessionUser')?.value;

    let payload: SessionPayload | null = null;
    /*let isAdmin = false;*/

    if (session) {
        payload = await decrypt(session) as SessionPayload;
    } else if (sessionUser) {
        payload = await decrypt(sessionUser) as SessionPayload;
        /*isAdmin = true;*/
    }

    if (!payload || new Date(payload.exp * 1000) < new Date()) {
        // Vérifier si c'est une requête API (par exemple en vérifiant le chemin ou les en-têtes)
        const isApiRequest = pathname.startsWith('/api/');

        if (isApiRequest) {
            // Pour les requêtes API, renvoyer un JSON
            return new NextResponse(
                JSON.stringify({ message: 'Non autorisé' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } else {
            // Pour les requêtes de page, rediriger vers la page unauthorized
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
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
    matcher: ['/profil', '/shop', '/user/:path*'], // Protéger ces routes
};