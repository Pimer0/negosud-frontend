'use server'

import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/interfaces/SessionPayload';
import { cookies } from 'next/headers'

import { ResponseData} from '@/interfaces/ResponseData'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session', error)
    }
}



export async function createSession(response: ResponseData) {
    console.log('Raw response:', JSON.stringify(response, null, 2));

    const clientId = response?.data?.clientId;
    const token = response?.data?.acessToken || response?.tokenJWT;

    console.log('Extracted data:', { clientId, token });

    if (!clientId || !token) {
        throw new Error(`Invalid session data: ${JSON.stringify(response)}`);
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const cookieStore = await cookies()

    cookieStore.set('session', token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })

    cookieStore.set('clientId', clientId.toString(), {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })

    return response;
}

export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession() {
    const cookieStore = await cookies();
    return {
        token: cookieStore.get('token')?.value,
        clientId: cookieStore.get('clientId')?.value
    };
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}