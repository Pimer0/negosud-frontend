'use client';

import React, { useState, useEffect } from "react";
import HeaderUser from "@/components/HeaderUser";
import Footer from "@/components/footer"; // Notez le 'f' minuscule
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import { FaPlus, FaTrash } from "react-icons/fa";
import { barlowCondensed } from "@/app/fonts";
import { cookies } from 'next/headers'

interface Fournisseur {
  fournisseurId: number;
  nom: string;
  raisonSociale: string;
  email: string;
  tel: string;
}

interface Article {
  articleId: number;
  libelle: string;
  reference: string;
  prix: number;
  fournisseur: {
    fournisseurId: number;
    nom: string;
  };
}

interface OrderLine {
  articleId: number;
  libelle: string;
  reference: string;
  quantity: number;
  price: number;
}

export default function CommandeFournisseur() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState<number | null>(null);
  const [fournisseurNom, setFournisseurNom] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer la liste des fournisseurs au chargement de la page
  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5141/api/Fournisseur');
        const result = await response.json();
        
        if (result.success) {
          setFournisseurs(result.data);
        } else {
          setError('Erreur lors de la récupération des fournisseurs: ' + result.message);
        }
      } catch (error) {
        setError('Erreur de connexion au serveur');
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFournisseurs();
  }, []);

  // Récupérer les articles du fournisseur sélectionné
  const fetchArticles = async (fournisseurId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5141/api/Article/fournisseur/${fournisseurId}`);
      const result = await response.json();
      
      if (result.success) {
        setArticles(result.data);
        // Trouver le nom du fournisseur
        const fournisseur = fournisseurs.find(f => f.fournisseurId === fournisseurId);
        if (fournisseur) {
          setFournisseurNom(fournisseur.nom);
        }
      } else {
        setError('Erreur lors de la récupération des articles: ' + result.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer le changement de fournisseur
  const handleFournisseurChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fournisseurId = parseInt(e.target.value);
    setSelectedFournisseur(fournisseurId);
    setOrderLines([]);
    
    if (fournisseurId) {
      fetchArticles(fournisseurId);
    } else {
      setArticles([]);
    }
  };

  // Ajouter une ligne de commande
  const addOrderLine = () => {
    if (articles.length > 0) {
      const defaultArticle = articles[0];
      setOrderLines([
        ...orderLines, 
        {
          articleId: defaultArticle.articleId,
          libelle: defaultArticle.libelle,
          reference: defaultArticle.reference,
          quantity: 1,
          price: defaultArticle.prix
        }
      ]);
    }
  };

  // Supprimer une ligne de commande
  const deleteOrderLine = (index: number) => {
    const newOrderLines = [...orderLines];
    newOrderLines.splice(index, 1);
    setOrderLines(newOrderLines);
  };

  // Mettre à jour la quantité d'une ligne
  const updateQuantity = (index: number, quantity: number) => {
    const newOrderLines = [...orderLines];
    newOrderLines[index].quantity = quantity;
    setOrderLines(newOrderLines);
  };

    const getCookie =  async (name: string) => {
    const cookieStore = await cookies()
    console.log(cookieStore.get(name));
    return cookieStore.get(name)
    };

  // Mettre à jour l'article d'une ligne
  const updateArticle = (index: number, articleId: number) => {
    const article = articles.find(a => a.articleId === articleId);
    if (article) {
      const newOrderLines = [...orderLines];
      newOrderLines[index] = {
        articleId: article.articleId,
        libelle: article.libelle,
        reference: article.reference,
        quantity: newOrderLines[index].quantity,
        price: article.prix
      };
      setOrderLines(newOrderLines);
    }
  };

  // Calculer le prix total
  const calculateTotalPrice = () => {
    return orderLines.reduce((total, line) => total + (line.price * line.quantity), 0).toFixed(2);
  };

  // Envoyer la commande
  const submitOrder = async () => {
    if (!selectedFournisseur || orderLines.length === 0) {
      setError("Veuillez sélectionner un fournisseur et ajouter au moins une ligne de commande.");
      return;
    }

    try {
      setLoading(true);
      // Récupérer l'ID de l'utilisateur depuis les cookies
      const userId = getCookie('UserId') || "1";
      
      const payload = {
        prix: parseFloat(calculateTotalPrice()),
        utilisateurId: parseInt(userId), // Utilisation de l'ID de l'utilisateur connecté depuis les cookies
        fournisseurID: selectedFournisseur,
        ligneCommandes: orderLines.map(line => ({
          articleId: line.articleId,
          quantite: line.quantity,
          prixUnitaire: line.price
        }))
      };

      // Récupérer le token JWT complet depuis les cookies
      // Notez que le format du cookie semble complexe et peut contenir plusieurs parties
      // Essayons différentes possibilités pour extraire le token
      const authToken = getCookie('admin_token');
      
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // N'ajouter l'en-tête d'autorisation que si le token existe
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        // Si on ne trouve vraiment pas le token, on peut utiliser une alternative temporaire 
        // pour les tests (à supprimer en production)
        console.warn("Token d'authentification non trouvé dans les cookies");
      }
      
      const response = await fetch('http://localhost:5141/api/BonCommande/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Commande passée avec succès !");
        // Réinitialiser le formulaire
        setOrderLines([]);
      } else {
        setError('Erreur lors de la création de la commande: ' + result.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderUser existingSessionUser={{ name: 'session', value: 'true' } as any} />

      <EncartForm titre="Passez commande aux fournisseurs" customWidth="w-full md:w-3/4 lg:w-2/3">
        <div className="w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button className="float-right font-bold" onClick={() => setError(null)}>&times;</button>
            </div>
          )}

          {/* Sélection du fournisseur */}
          <div className="mb-6">
            <label className={`block font-semibold ${barlowCondensed.className} text-lg mb-2`}>
              Sélectionner un fournisseur <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full border border-custom-dark rounded p-2 bg-white"
              value={selectedFournisseur || ''}
              onChange={handleFournisseurChange}
              disabled={loading}
            >
              <option value="">-- Choisir un fournisseur --</option>
              {fournisseurs.map(fournisseur => (
                <option key={fournisseur.fournisseurId} value={fournisseur.fournisseurId}>
                  {fournisseur.nom}
                </option>
              ))}
            </select>
          </div>

          {selectedFournisseur && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className={`font-semibold ${barlowCondensed.className} text-lg`}>
                  Lignes de commande pour {fournisseurNom}
                </p>
                {articles.length > 0 && (
                  <Bouton
                    text="Ajouter une ligne"
                    colorClass="bg-custom-dark text-white"
                    hoverColorClass="hover:bg-white hover:text-custom-dark"
                    onClick={addOrderLine}
                    childrenIcon={<FaPlus className="ml-2 mt-1" />}
                  />
                )}
              </div>

              {articles.length === 0 ? (
                <p className="text-center p-4 border border-dashed border-gray-300 rounded">
                  Aucun article disponible pour ce fournisseur
                </p>
              ) : orderLines.length === 0 ? (
                <p className="text-center p-4 border border-dashed border-gray-300 rounded">
                  Ajoutez des lignes de commande en utilisant le bouton ci-dessus
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-custom-dark">
                        <th className="text-left p-2">Article</th>
                        <th className="text-left p-2">Référence</th>
                        <th className="text-left p-2">
                          <span className="flex items-center">
                            Quantité <span className="text-red-500 ml-1">*</span>
                          </span>
                        </th>
                        <th className="text-left p-2">Prix unitaire</th>
                        <th className="text-left p-2">Prix total</th>
                        <th className="text-center p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLines.map((line, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="p-2">
                            <select 
                              className="w-full border border-custom-dark rounded p-2"
                              value={line.articleId}
                              onChange={(e) => updateArticle(index, parseInt(e.target.value))}
                            >
                              {articles.map(article => (
                                <option key={article.articleId} value={article.articleId}>
                                  {article.libelle}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              className="w-full border border-custom-dark rounded p-2 bg-gray-100"
                              value={line.reference}
                              readOnly 
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" 
                              className="w-full border border-custom-dark rounded p-2"
                              value={line.quantity}
                              min="1"
                              onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              className="w-full border border-custom-dark rounded p-2 bg-gray-100"
                              value={`${line.price.toFixed(2)} €`}
                              readOnly 
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              className="w-full border border-custom-dark rounded p-2 bg-gray-100"
                              value={`${(line.price * line.quantity).toFixed(2)} €`}
                              readOnly 
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button 
                              onClick={() => deleteOrderLine(index)}
                              className="text-custom-dark hover:text-red-500 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orderLines.length > 0 && (
                        <tr className="border-t border-gray-200 font-bold">
                          <td colSpan={4} className="p-2 text-right">Total:</td>
                          <td className="p-2">{calculateTotalPrice()} €</td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-8 justify-between">
            <Bouton
              text="Retour"
              colorClass="bg-white"
              hoverColorClass="hover:bg-gray-100 hover:text-custom-dark"
              onClick={() => window.history.back()}
            />
            
            {selectedFournisseur && orderLines.length > 0 && (
              <Bouton
                text="Commander"
                colorClass="bg-custom-dark text-white"
                hoverColorClass="hover:bg-white hover:text-custom-dark"
                onClick={submitOrder}
                customType="button"
              />
            )}
          </div>
        </div>
      </EncartForm>

      <Footer />
    </div>
  );
}