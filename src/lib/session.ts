'use server'

import 'server-only'
import { importSPKI, SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/interfaces/SessionPayload';
import { cookies } from 'next/headers'
import { ResponseData } from '@/interfaces/ResponseData'

// 1. Déplacer la récupération de la clé dans une fonction asynchrone
async function getPublicKey() {
    const response = await fetch('http://localhost:5141/api/Jwt/public-key');
    const publicKeyBase64 = await response.text();
    // Ajout des retours à la ligne corrects pour le format PEM
    const pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
    return await importSPKI(pemKey, 'RS256');
}

export async function encrypt(payload: SessionPayload) {
    // 2. Récupérer la clé publique pour le chiffrement
    const publicKey = await getPublicKey();

    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(publicKey) // Utiliser la clé publique ici
}

export async function decrypt(session: string | undefined = '') {
    try {
        if (!session) {
            return null;
        }

        // 3. Utiliser la même fonction de récupération de clé
        const publicKey = await getPublicKey();

        const { payload } = await jwtVerify(session, publicKey, {
            algorithms: ['RS256'],
        });

        return payload;
    } catch (error) {
        console.error('Erreur de déchiffrement:', error);
        throw error;
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