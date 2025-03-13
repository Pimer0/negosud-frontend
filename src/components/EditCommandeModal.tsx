'use client';

import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { barlowCondensed } from "@/app/fonts";
import Bouton from "@/components/Bouton";
import { getSessionUser } from "@/lib/session";
import { BonCommandeDetail } from "@/interfaces/BonCommandeDetail";
import { LigneBonCommande } from "@/interfaces/LigneBonCommande";

interface EditCommandeModalProps {
  isOpen: boolean;
  onClose: () => void;
  commandeId: number | null;
  onCommandeUpdated: () => void;
}

const STATUSES = ["En attente", "Validée", "En cours de livraison", "Livrée", "Annulée"];

export default function EditCommandeModal({ 
  isOpen, 
  onClose, 
  commandeId, 
  onCommandeUpdated 
}: EditCommandeModalProps) {
  const [commande, setCommande] = useState<BonCommandeDetail | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("En attente"); // Valeur par défaut initiale

  // récupération des données de la commande
  useEffect(() => {
    const fetchCommandeDetails = async () => {
      if (!commandeId || !isOpen) return;

      try {
        setLoading(true);
        const session = await getSessionUser();
        
        const response = await fetch(`http://localhost:5141/api/BonCommande/${commandeId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          setCommande(result.data);
          // S'assurer que status n'est jamais undefined ou null
          setStatus(result.data.status || "En attente");
          
          // récupérat les articles du fournisseur
          fetchArticlesByFournisseur(result.data.fournisseur.fournisseurId);
        } else {
          setError('Erreur lors de la récupération des détails de la commande: ' + result.message);
        }
      } catch (error) {
        setError('Erreur de connexion au serveur');
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandeDetails();
  }, [commandeId, isOpen]);

  // réinitalise l'état quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setCommande(null);
      setArticles([]);
      setStatus("En attente");
    }
  }, [isOpen]);

  // récupère les articles du fournisseur
  const fetchArticlesByFournisseur = async (fournisseurId: number) => {
    try {
      const response = await fetch(`http://localhost:5141/api/Article/fournisseur/${fournisseurId}`);
      const result = await response.json();
      
      if (result.success) {
        setArticles(result.data);
      } else {
        setError('Erreur lors de la récupération des articles: ' + result.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    }
  };

  // mise à jour la quantité d'une ligne
  const updateQuantity = (index: number, quantity: number) => {
    if (!commande) return;
    
    const updatedLines = [...commande.ligneBonCommandes];
    updatedLines[index].quantite = quantity;
    
    setCommande({
      ...commande,
      ligneBonCommandes: updatedLines
    });
  };

  // mise à jour la lirvaison d'une ligne
  const updateLivree = (index: number, livree: boolean) => {
    if (!commande) return;
    
    const updatedLines = [...commande.ligneBonCommandes];
    updatedLines[index].livree = livree;
    
    setCommande({
      ...commande,
      ligneBonCommandes: updatedLines
    });
  };

  // ajout d' une nouvelle ligne
  const addLine = () => {
    if (!commande || articles.length === 0) return;
    
    const defaultArticle = articles[0];
    const newLine: LigneBonCommande = {
      ligneBonCommandeId: 0,
      articleId: defaultArticle.articleId,
      article: defaultArticle,
      quantite: 1,
      prixUnitaire: defaultArticle.prix,
      livree: false
    };
    
    setCommande({
      ...commande,
      ligneBonCommandes: [...commande.ligneBonCommandes, newLine]
    });
  };

  // supprimer une ligne
  const deleteLine = async (index: number, ligneBonCommandeId: number) => {
    if (!commande) return;
    
    try {
      // Si c'est une nouvelle ligne (ID ≤ 0), on la supprime juste du state
      if (ligneBonCommandeId <= 0) {
        const updatedLines = [...commande.ligneBonCommandes];
        updatedLines.splice(index, 1);
        
        setCommande({
          ...commande,
          ligneBonCommandes: updatedLines
        });
        return;
      }
      
      // Si c'est une ligne existante, on appelle l'API de suppression
      setLoading(true);
      const session = await getSessionUser();
      
      const response = await fetch(`http://localhost:5141/api/BonCommande/delete/ligne-commande/${ligneBonCommandeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Suppression réussie, mettre à jour l'état local
        const updatedLines = [...commande.ligneBonCommandes];
        updatedLines.splice(index, 1);
        
        setCommande({
          ...commande,
          ligneBonCommandes: updatedLines
        });
      } else {
        setError('Erreur lors de la suppression de la ligne: ' + result.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // mise à jour de l'article d'une ligne
  const updateArticle = (index: number, articleId: number) => {
    if (!commande) return;
    
    const article = articles.find(a => a.articleId === articleId);
    if (!article) return;
    
    const updatedLines = [...commande.ligneBonCommandes];
    updatedLines[index] = {
      ...updatedLines[index],
      articleId: article.articleId,
      article: article,
      prixUnitaire: article.prix
    };
    
    setCommande({
      ...commande,
      ligneBonCommandes: updatedLines
    });
  };

  // calcul du prix total
  const calculateTotalPrice = () => {
    if (!commande) return "0.00";
    return commande.ligneBonCommandes
      .reduce((total, line) => total + (line.prixUnitaire * line.quantite), 0)
      .toFixed(2);
  };

  // enregistrer les modifications
  const saveChanges = async () => {
    if (!commande) return;
    
    try {
      setLoading(true);
      const session = await getSessionUser();
      
      // Préparer le payload en n'incluant que les champs nécessaires
      const payload = {
        status: status,
        ligneCommandes: commande.ligneBonCommandes.map(line => ({
          ligneBonCommandeId: line.ligneBonCommandeId,
          articleId: line.articleId,
          quantite: line.quantite,
          livree: line.livree
        }))
      };
      
      const response = await fetch(`http://localhost:5141/api/BonCommande/update/${commande.bonCommandeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.success) {
        onCommandeUpdated();
        onClose();
      } else {
        setError('Erreur lors de la mise à jour de la commande: ' + result.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${barlowCondensed.className}`}>
              Modifier la commande
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-custom-dark transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button className="float-right font-bold" onClick={() => setError(null)}>
                &times;
              </button>
            </div>
          )}

          {loading && !commande ? (
            <div className="py-8 text-center">
              <p>Chargement des données...</p>
            </div>
          ) : commande ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-semibold mb-1">Référence:</p>
                  <p>{commande.reference}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Fournisseur:</p>
                  <p>{commande.fournisseur.nom}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Date de création:</p>
                  <p>{new Date(commande.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Statut:</label>
                  <select
                    className="w-full border border-custom-dark rounded p-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-semibold ${barlowCondensed.className}`}>
                    Lignes de commande
                  </h3>
                  <Bouton
                    text="Ajouter une ligne"
                    colorClass="bg-custom-dark text-white"
                    hoverColorClass="hover:bg-white hover:text-custom-dark"
                    onClick={addLine}
                    childrenIcon={<FaPlus className="ml-2 mt-1" />}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-custom-dark">
                        <th className="text-left p-2">Article</th>
                        <th className="text-left p-2">Référence</th>
                        <th className="text-left p-2">Quantité</th>
                        <th className="text-left p-2">Prix unitaire</th>
                        <th className="text-left p-2">Prix total</th>
                        <th className="text-center p-2">Livrée</th>
                        <th className="text-center p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commande.ligneBonCommandes.map((line, index) => (
                        <tr key={`line-${index}-${line.articleId}`} className="border-t border-gray-200">
                          <td className="p-2">
                            <select
                              className="w-full border border-custom-dark rounded p-2"
                              value={line.articleId}
                              onChange={(e) => updateArticle(index, parseInt(e.target.value))}
                            >
                              {articles.map((article) => (
                                <option key={`article-${article.articleId}-${index}`} value={article.articleId}>
                                  {article.libelle}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              className="w-full border border-custom-dark rounded p-2 bg-gray-100"
                              value={line.article.reference || ""}
                              readOnly
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              className="w-full border border-custom-dark rounded p-2"
                              value={line.quantite}
                              min="1"
                              onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              className="w-full border border-custom-dark rounded p-2 bg-gray-100"
                              value={`${line.prixUnitaire.toFixed(2)} €`}
                              readOnly
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              className="w-full border border-custom-dark rounded p-2 bg-gray-100"
                              value={`${(line.prixUnitaire * line.quantite).toFixed(2)} €`}
                              readOnly
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              className="w-5 h-5"
                              checked={line.livree}
                              onChange={(e) => updateLivree(index, e.target.checked)}
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => deleteLine(index, line.ligneBonCommandeId)}
                              className="text-custom-dark hover:text-red-500 transition-colors"
                              title="Supprimer"
                              disabled={loading}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr key="total-row" className="border-t border-gray-200 font-bold">
                        <td colSpan={4} className="p-2 text-right">
                          Total:
                        </td>
                        <td className="p-2">{calculateTotalPrice()} €</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Bouton
                  text="Annuler"
                  colorClass="bg-white"
                  hoverColorClass="hover:bg-gray-100 hover:text-custom-dark"
                  onClick={onClose}
                  customType="button"
                />
                <Bouton
                  text="Enregistrer"
                  colorClass="bg-custom-dark text-white"
                  hoverColorClass="hover:bg-white hover:text-custom-dark"
                  onClick={saveChanges}
                  customType="button"
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <p className="py-8 text-center">Aucune donnée disponible</p>
          )}
        </div>
      </div>
    </div>
  );
}