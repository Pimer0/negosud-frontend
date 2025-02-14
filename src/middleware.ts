import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import type { NextRequest } from 'next/server';
import { SessionPayload } from '@/interfaces/SessionPayload';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const sessionUser = request.cookies.get('sessionUser')?.value;
    let payload: SessionPayload | null = null;
    let isAdmin = false;

    try {
        if (session) {
            payload = await decrypt(session) as SessionPayload;
        } else if (sessionUser) {
            payload = await decrypt(sessionUser) as SessionPayload;
            isAdmin = true;
        }

        console.log('échec de decryptage du payload:', payload);

        if (!payload || !payload.expiresAt || new Date(payload.exp * 1000) < new Date()) {
            return NextResponse.redirect(new URL(isAdmin ? '/admin/login' : '/client/login', request.url));
        }

        // Add user information to the request headers
        request.headers.set('userId', payload.userId);
        request.headers.set('DateExp', payload.expiresAt.toString());

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL(isAdmin ? '/admin/login' : '/client/login', request.url));
    }
}

// Apply the middleware to specific routes
export const config = {
    matcher: ['/dashboard', '/profile', '/shop', '/admin'],
};