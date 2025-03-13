'use server'

import 'server-only'
import { importSPKI, SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/interfaces/SessionPayload';
import { cookies } from 'next/headers'
import {ResponseData, ResponseDataUser} from '@/interfaces/ResponseData'


async function getPublicKey() {
    const response = await fetch('http://localhost:5141/api/Jwt/public-key');
    const publicKeyBase64 = await response.text();
    // Ajout des retours à la ligne corrects pour le format PEM
    const pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
    return await importSPKI(pemKey, 'RS256');
}

export async function encrypt(payload: SessionPayload) {
    const publicKey = await getPublicKey();

    const jwt = new SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt(Math.floor(Date.now() / 1000)) // Vérification de l'iat
        .setExpirationTime('7d');

    console.log("JWT avant signature:", jwt);

    const signedToken = await jwt.sign(publicKey);
    console.log("JWT signé:", signedToken);

    return signedToken;
}


export async function decrypt(session: string | undefined = '') {
    try {
        if (!session) {
            return null;
        }

        const publicKey = await getPublicKey();

        const { payload } = await jwtVerify(session, publicKey, {
            algorithms: ['RS256'],
        });


        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            await deleteSession();
            return null;
        }

        return payload;
    } catch (error) {
        console.error('Erreur de déchiffrement:', error);
        await deleteSession();
        return null;
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

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();

    // Invalider la session utilisateur si elle existe
    cookieStore.delete('sessionUser');
    cookieStore.delete('UserId');

    cookieStore.set('session', token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

    cookieStore.set('clientId', clientId.toString(), {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

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
    cookieStore.delete('clientId')
}

/// Partie Admin/User:

export async function createSessionUser(response: ResponseDataUser) {
    console.log('Raw response:', JSON.stringify(response, null, 2));

    const Id = response?.data?.id;
    const token = response?.tokenJWT;

    console.log('Extracted data:', { Id, token });

    if (!Id || !token) {
        throw new Error(`Invalid session data: ${JSON.stringify(response)}`);
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();

    // Invalider la session client si elle existe
    cookieStore.delete('session');
    cookieStore.delete('clientId');

    cookieStore.set('sessionUser', token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

    cookieStore.set('UserId', Id.toString(), {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

    return response;
}

export async function getSessionUser() {
    const cookieStore = await cookies();
    return {
        token: cookieStore.get('sessionUser')?.value,
        UserId: cookieStore.get('UserId')?.value
    };
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('UserId');
    cookieStore.delete('sessionUser')
}
