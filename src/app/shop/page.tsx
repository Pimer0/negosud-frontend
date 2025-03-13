'use client';
import React, {useEffect, useState} from 'react';
import Produit from "@/components/Produit";
import GestionCartShop from "@/components/GestionCartShop";
import {ProduitData} from "@/interfaces/ProduitData";
import {Famille} from "@/interfaces/Famille";
import SearchBar from "@/components/SearchBar";

export default function Shop() {
    const [produits, setProduits] = useState<ProduitData[]>([]);
    const [filteredProduits, setFilteredProduits] = useState<ProduitData[]>([]);
    const [searchActive, setSearchActive] = useState(false);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch('http://localhost:5141/api/Article');
                const data = await response.json();

                if (data?.data) {
                    setProduits(data.data);
                    setFilteredProduits(data.data); // Initialiser avec tous les produits
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
        const familleNom = famille?.nom?.toLowerCase();

        switch (familleNom) {
            case "rouge":
                return "/rouge.png";
            case "blanc":
                return "/blanc.png";
            case "rosé":
                return "/rose.png";
            default:
                return "/default.png";
        }
    };

    const handleSearch = (query: string) => {
        if (query === '') {
            // Si la requête est vide, réafficher tous les produits
            setFilteredProduits(produits);
            setSearchActive(false);
        } else {
            // Sinon, filtrer les produits selon la requête
            const filtered = produits.filter((produit) =>
                produit.libelle.toLowerCase().includes(query.toLowerCase()) ||
                produit.reference.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProduits(filtered);
            setSearchActive(true);
        }
    };

    // Détermine les produits à afficher
    const produitsToDisplay = searchActive ? filteredProduits : produits;

    return (
        <div className="grid grid-rows-[auto_auto_auto_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-2">Boutique</h1>
            <h2 className="text-xl">Cherchez un produit:</h2>
            <SearchBar onSearch={handleSearch}/>

            {searchActive && filteredProduits.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    Aucun produit ne correspond à votre recherche
                </div>
            ) : (
                <div className="flex flex-col">
                    {produitsToDisplay.map((produit) => (
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
            )}
        </div>
    );
};