'use client';
                import React, { useEffect, useState } from 'react';
                import Produit from "@/components/Produit";
                import GestionCartShop from "@/components/GestionCartShop";
                import { ProduitData } from "@/interfaces/ProduitData";
                import { Famille } from "@/interfaces/Famille"; // Importez l'interface Famille

                export default function Shop() {
                    const [produits, setProduits] = useState<ProduitData[]>([]);

                    useEffect(() => {
                        const fetchProduits = async () => {
                            try {
                                const response = await fetch('http://localhost:5141/api/Article');
                                const data = await response.json();

                                if (data?.data) {
                                    setProduits(data.data);
                                } else {
                                    console.error("Données invalides reçues :", data);
                                }
                            } catch (error) {
                                console.error('Erreur lors de la récupération des produits:', error);
                            }
                        };

                        fetchProduits();
                    }, []);

                    const handleImg = (famille: Famille | null) => {
                        const familleNom = famille?.nom?.toLowerCase(); // Accédez à la propriété `nom` de l'objet `famille` et convertissez en minuscules

                        switch (familleNom) {
                            case "rouge":
                                return "/rouge.png";
                            case "blanc":
                                return "/blanc.png";
                            case "rosé":
                                return "/rose.png";
                            default:
                                return "/default.png"; // Image par défaut si la famille est inconnue
                        }
                    };

                    return (
                        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                            <h1>Boutique</h1>
                            <div className="flex flex-col">
                                {produits.map((produit) => (
                                    <Produit
                                        key={produit.articleId}
                                        articleId={produit.articleId}
                                        reference={produit.reference}
                                        libelle={produit.libelle}
                                        famille={produit.famille ?? { nom: "Inconnu" }}
                                        prix={produit.prix}
                                        img={handleImg(produit.famille)}
                                    >
                                        <GestionCartShop
                                            articleId={produit.articleId}
                                            initialQuantite={produit.quantite ?? 0}
                                            commandId={produit.commandId ?? null}
                                            ligneCommandeId={produit.ligneCommandeId ?? null}
                                        />
                                    </Produit>
                                ))}
                            </div>
                        </div>
                    );
                }