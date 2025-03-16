'use client';

import React from 'react';
import { useEffect } from 'react';
import Encart from '@/components/Encart';
import Bouton from '@/components/Bouton';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
    useEffect(() => {
        console.log('Page de confirmation chargée');
    }, []);
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Encart 
                titre="Merci pour votre commande"
                corps="Votre commande a été validée avec succès et est en cours de traitement"
                customWidth="max-w-md w-full"
            >   
                <div className="flex justify-center">
                <Bouton onClick={() => router.push('/shop')} text="Retourner à la boutique">

                </Bouton>
                </div>
            </Encart>
        </div>
    );
}