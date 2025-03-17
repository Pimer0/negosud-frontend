'use client';
import React, { useEffect, useState } from 'react';
import GestionCartBasket from "@/components/GestionCartBasket";
import { ProduitData } from "@/interfaces/ProduitData";
import { getSession } from "@/lib/session";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { fetchWithSession } from '@/lib/fetchWithSession';

export default function Basket() {
    const [panier, setPanier] = useState<PanierData>({ ligneCommandes: [], commandeId: 0 });
    const [totalPrice, setTotalPrice] = useState(0);
    const [produits, setProduits] = useState<ProduitData[]>([]);
    const [clientId, setClientId] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchClientId = async () => {
            const session = await getSession();
            if (session?.clientId) {
                const clientId = Number(session.clientId);
                setClientId(clientId);
            }
        };

        const fetchProduits = async () => {
            try {
                const data = await fetchWithSession(`/api/Panier/${clientId}`);

                if (data?.data) {
                    setPanier(data.data);
                    setProduits(data.data.ligneCommandes.map((ligne: LigneCommande) => ligne.article));
                } else {
                    console.error("Données invalides reçues :", data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
            }
        };

        fetchClientId();

        if (clientId) {
            fetchProduits();
        }
    }, [clientId]);

    useEffect(() => {
        const calculateTotalPrice = () => {
            let total = 0;
            if (panier?.ligneCommandes && Array.isArray(panier.ligneCommandes)) {
                panier.ligneCommandes.forEach((ligne: LigneCommande) => {
                    total += ligne.article.prix * ligne.quantite;
                });
            }
            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [panier]);

    // fonction de mise à jour appelée lorsque la quantité change
    const handleQuantityChange = (articleId: number, newQuantite: number) => {
        setPanier(prevPanier => {
            if (!prevPanier?.ligneCommandes || !Array.isArray(prevPanier.ligneCommandes)) {
                return prevPanier; // retourne l'état actuel si ligneCommandes n'existe pas ou n'est pas un tableau
            }

            const updatedPanier = {
                ...prevPanier,
                ligneCommandes: prevPanier.ligneCommandes.map(produit => {
                    if (produit.article.articleId === articleId) {
                        return { ...produit, quantite: newQuantite };
                    }
                    return produit;
                }),
            };
            return updatedPanier;
        });
    };

    // supprime un article du panier
    const handleRemove = (articleId: number) => {
        setPanier(prevPanier => {
            if (!prevPanier?.ligneCommandes || !Array.isArray(prevPanier.ligneCommandes)) {
                return prevPanier; // retourne l'état actuel si ligneCommandes n'existe pas ou n'est pas un tableau
            }

            const updatedPanier = {
                ...prevPanier,
                ligneCommandes: prevPanier.ligneCommandes.filter(produit => produit.article.articleId !== articleId),
            };
            return updatedPanier;
        });

        // mis à jour les produits affichés
        setProduits(prevProduits => prevProduits.filter(produit => produit.articleId !== articleId));
    };

    // fonction pour gérer le clic sur le bouton "Commander"
    const handleCommande = async () => {
        if (!panier?.commandeId) {
            console.error("Aucune commande ID disponible pour créer la session de paiement.");
            return;
        }

        const amount = totalPrice * 100; // stripe utilise des centimes...
        const currency = "eur";
        const successUrl = "http://localhost:3000/command/success"; // URL de redirection en cas de succès 
        const cancelUrl = "http://localhost:3000/basket"; // URL de redirection si paiement annuler

        try {
            
            const response = await fetch("http://localhost:5141/api/Stripe/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    successUrl,
                    cancelUrl,
                    commandeId: panier.commandeId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur lors de la création de la session de paiement: ${errorData.message}`);
            }

            const data = await response.json();
            router.push(data.url)// redirection l'utilisateur vers la page de paiement Stripe
        } catch (error) {
            console.error("Erreur lors de la création de la session de paiement:", error);
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-center gap-10 sm:p-8 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold">Votre panier</h1>
            <div className="flex flex-col w-full max-w-[1440px] gap-4">
                {produits.map((produit) => (
                    <div key={produit.articleId} className="flex flex-col bg-white p-4 border rounded-lg items-start h-auto w-full sm:h-[250px] sm:flex-row sm:items-center overflow-hidden">
                        <Image width={200} height={200} src={`/${produit.famille?.nom?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.png`} alt={"Vin"} className="rounded-lg object-cover w-full sm:w-[150px] sm:h-[200px]" />

                        {/* descri du Produit */}
                        <div className="flex flex-col items-start justify-between sm:w-full h-full sm:mr-[150px] sm:mt-0 sm:ml-4">
                            <div className="w-full sm:mt-10 sm:w-2">
                                <span className="font-bold text-gray-700 block">{produit.libelle}</span>
                                <span className="text-sm text-gray-500 block">{produit.famille.nom}</span>
                            </div>

                            <div className="w-full sm:mb-2">
                                <span className="text-sm font-semibold text-gray-700 mt-auto">{produit.prix} €</span>
                            </div>
                        </div>

                        <div className="flex items-center mr-2 sm:mt-0">
                            <GestionCartBasket
                                articleId={produit.articleId}
                                initialQuantite={produit.quantite ?? 0}
                                commandId={produit.commandId ?? null}
                                ligneCommandeId={produit.ligneCommandeId ?? null}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* encart total, prix, bouton commander */}
            <div className="border-t border-custom-dark w-full max-w-[1440px] my-4"></div>

            <div className="flex justify-between w-full max-w-[1440px]">
                <span className="font-bold text-gray-700">Total:</span>
                <span className="text-gray-700">{totalPrice.toFixed(2)} €</span>
            </div>

            <div className='flex justify-center mt-6'>
                <button onClick={handleCommande} className='px-20 py-4 bg-custom-dark rounded-lg text-zinc-200 text-sm'>Commander</button>
            </div>
        </div>
    );
}
