'use client';
import React, {useEffect, useState} from 'react';
import Produit from "@/components/Produit";
import GestionCartShop from "@/components/GestionCartShop";
import {ProduitData} from "@/interfaces/ProduitData";
import {Famille} from "@/interfaces/Famille";
import SearchBar from "@/components/SearchBar";

export default function Shop() {
    const [produits, setProduits] = useState<ProduitData[]>([]);
    const [, setFilteredProduits] = useState<ProduitData[]>([]);
    const [displayedProduits, setDisplayedProduits] = useState<ProduitData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFamille, setSelectedFamille] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortType, setSortType] = useState<'default' | 'prix'>('default');

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch('http://localhost:5141/api/Article');
                const data = await response.json();

                if (data?.data) {
                    setProduits(data.data);
                    setFilteredProduits(data.data);
                    setDisplayedProduits(data.data);
                } else {
                    console.error("Données invalides reçues :", data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
            }
        };

        fetchProduits();
    }, []);

    useEffect(() => {

        applyFiltersAndSort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFamille, sortType, sortOrder, searchQuery, produits]);

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
        setSearchQuery(query);
    };

    const handleFamilleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFamille(e.target.value);
    };

    const applyFiltersAndSort = () => {

        let result = [...produits];

        if (searchQuery) {
            result = result.filter((produit) =>
                produit.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                produit.reference.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }


        if (selectedFamille) {
            result = result.filter(produit =>
                produit.famille?.nom?.toLowerCase() === selectedFamille.toLowerCase()
            );
        }


        if (sortType === 'prix') {
            result.sort((a, b) => {
                return sortOrder === 'asc'
                    ? a.prix - b.prix
                    : b.prix - a.prix;
            });
        }


        setFilteredProduits(result);
        setDisplayedProduits(result);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const resetFilters = () => {
        setSelectedFamille('');
        setSortType('default');
        setSortOrder('asc');
        setSearchQuery('');
        setFilteredProduits(produits);
        setDisplayedProduits(produits);
    };

    return (
        <div className="grid grid-rows-[auto_auto_auto_auto_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-2">Boutique</h1>
            <h2 className="text-xl">Cherchez un produit:</h2>
            <SearchBar onSearch={handleSearch}/>


            <div className="flex flex-wrap gap-4 w-full justify-center">

                <div className="flex items-center">
                    <label htmlFor="famille-select" className="mr-2 font-medium">Famille:</label>
                    <select
                        id="famille-select"
                        value={selectedFamille}
                        onChange={handleFamilleChange}
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Toutes</option>
                        <option value="blanc">Blanc</option>
                        <option value="rouge">Rouge</option>
                        <option value="rosé">Rosé</option>
                    </select>
                </div>


                <button
                    onClick={() => {
                        if (sortType === 'prix') {
                            toggleSortOrder();
                        } else {
                            setSortType('prix');
                            setSortOrder('asc');
                        }
                    }}
                    className={`px-4 py-2 rounded font-medium ${
                        sortType === 'prix' ? 'bg-[#1E4147] text-white' : 'bg-white text-[#1E4147]'
                    }`}
                >
                    Trier par Prix {sortType === 'prix' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>


                {(sortType !== 'default' || selectedFamille || searchQuery) && (
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium"
                    >
                        Réinitialiser
                    </button>
                )}
            </div>

            {displayedProduits.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    Aucun produit ne correspond à votre recherche
                </div>
            ) : (
                <div className="flex flex-col">
                    {displayedProduits.map((produit) => (
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