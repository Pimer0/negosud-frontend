'use client';

import { useState, useEffect } from "react";
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import { FaPlus, FaTrash,FaClipboardList, FaEdit } from "react-icons/fa";
import { barlowCondensed } from "@/app/fonts";
import {createCommande} from "@/app/user/commande/create";
import EditCommandeModal from "@/components/EditCommandeModal";
import { Fournisseur } from "@/interfaces/Fournisseur";
import { fetchAllArticlesByFournisseur, fetchAllCommande } from "@/app/user/commande/fetch";
import { BonCommande } from "@/interfaces/BonCommande";


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
  const [activeTab, setActiveTab] = useState<'creation' | 'gestion'>('creation');

  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState<number | null>(null);
  const [fournisseurNom, setFournisseurNom] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  const [commandes, setCommandes] = useState<BonCommande[]>([]);
  const [selectedCommande, setSelectedCommande] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  // rçupération des fournisseurs au chargement de la page
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

  // rçupération des articles du fournisseur sélectionné
  const fetchArticles = async (fournisseurId: number) => {
    try {
      setLoading(true);
      const result = await fetchAllArticlesByFournisseur(fournisseurId);

      if (result.success) {
        setArticles(result.data);
        // trovuer le nom du fournisseur
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

  // récupération des commandes existantes
  useEffect(() => {
    const fetchCommandes = async () => {
      if (activeTab === 'gestion') {
        try {
          setLoading(true);

          const result = await fetchAllCommande();
          
          if (result.success) {
            setCommandes(result.data);
          } else {
            setError('Erreur lors de la récupération des commandes: ' + result.message);
          }
        } catch (error) {
          setError('Erreur de connexion au serveur');
          console.error('Erreur:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCommandes();
  }, [activeTab]);

  // gestion du changement de fournisseur
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

  // ajout d'une ligne de commande
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

  const deleteOrderLine = (index: number) => {
    const newOrderLines = [...orderLines];
    newOrderLines.splice(index, 1);
    setOrderLines(newOrderLines);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newOrderLines = [...orderLines];
    newOrderLines[index].quantity = quantity;
    setOrderLines(newOrderLines);
  };

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


  const calculateTotalPrice = () => {
    return orderLines.reduce((total, line) => total + (line.price * line.quantity), 0).toFixed(2);
  };

  // envoie de la commande
  const submitOrder = async () => {
    if (!selectedFournisseur || orderLines.length === 0) {
      setError("Veuillez sélectionner un fournisseur et ajouter au moins une ligne de commande.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        prix: parseFloat(calculateTotalPrice()),
        fournisseurID: selectedFournisseur,
        ligneCommandes: orderLines.map(line => ({
          articleId: line.articleId,
          quantite: line.quantity,
          prixUnitaire: line.price
        }))
      };


      const result = await createCommande(payload);

      if (result.success) {
        alert("Commande passée avec succès !");
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return "Date invalide" + error;
    }
  };

  // fonctions pour le modal d'édition
  const openEditModal = (commandeId: number) => {
    setSelectedCommande(commandeId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCommande(null);
  };

  const handleCommandeUpdated = () => {
    // recharge la liste des commandes après une mise à jour
    if (activeTab === 'gestion') {
      const fetchCommandes = async () => {
        try {
          setLoading(true);
          const result = await fetchAllCommande();
          
          if (result.success) {
            setCommandes(result.data);
          } else {
            setError('Erreur lors de la récupération des commandes: ' + result.message);
          }
        } catch (error) {
          setError('Erreur de connexion au serveur');
          console.error('Erreur:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCommandes();
    }
  };

  return (
<div className="grid grid-cols-12 -mt-4 -mb-20">
      <div className="col-span-12 px-4 sm:col-span-12 sm:col-start-1 md:col-span-10 md:col-start-2 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3">
        <EncartForm titre="Gestion des commandes fournisseurs" customWidth="w-full">
          <div className="w-full">
            {/* tabs navigation */}
            <div className="flex border-b border-custom-dark mb-6">
              <button
                className={`py-2 px-4 font-medium flex items-center ${
                  activeTab === 'creation'
                    ? 'border-b-2 border-custom-dark text-custom-dark'
                    : 'text-gray-500 hover:text-custom-dark'
                }`}
                onClick={() => setActiveTab('creation')}
              >
                <FaEdit className="mr-2" /> Créer une commande
              </button>
              <button
                className={`py-2 px-4 font-medium flex items-center ${
                  activeTab === 'gestion'
                    ? 'border-b-2 border-custom-dark text-custom-dark'
                    : 'text-gray-500 hover:text-custom-dark'
                }`}
                onClick={() => setActiveTab('gestion')}
              >
                <FaClipboardList className="mr-2" /> Gérer les commandes
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
                <button className="float-right font-bold" onClick={() => setError(null)}>&times;</button>
              </div>
            )}

            {/* contenu des tabs */}
            {activeTab === 'creation' ? (
              // section création de commande
              <div>
                {/* sélection du fournisseur */}
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
                      <option key={`fournisseur-${fournisseur.fournisseurId}`} value={fournisseur.fournisseurId}>
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
                              <tr key={`order-line-${index}-${line.articleId}`} className="border-t border-gray-200">
                                <td className="p-2">
                                  <select 
                                    className="w-full border border-custom-dark rounded p-2"
                                    value={line.articleId}
                                    onChange={(e) => updateArticle(index, parseInt(e.target.value))}
                                  >
                                    {articles.map(article => (
                                      <option key={`article-option-${article.articleId}-${index}`} value={article.articleId}>
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
                              <tr key="total-row" className="border-t border-gray-200 font-bold">
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
            ) : (
              // section gestion des commandes
              <div>
                <h2 className={`font-semibold ${barlowCondensed.className} text-xl mb-4`}>
                  Liste des commandes fournisseurs
                </h2>
                
                {loading ? (
                  <p className="text-center py-4">Chargement des commandes...</p>
                ) : commandes.length === 0 ? (
                  <p className="text-center p-4 border border-dashed border-gray-300 rounded">
                    Aucune commande fournisseur trouvée
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-custom-dark">
                          <th className="text-left p-2">Référence</th>
                          <th className="text-left p-2">Fournisseur</th>
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Montant</th>
                          <th className="text-left p-2">Statut</th>
                          <th className="text-center p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commandes.map((commande) => (
                          <tr key={`commande-${commande.bonCommandeId}`} className="border-t border-gray-200">
                            <td className="p-2">{commande.reference}</td>
                            <td className="p-2">{commande.fournisseur?.nom || "N/A"}</td>
                            <td className="p-2">{formatDate(commande.dateCreation)}</td>
                            <td className="p-2">{commande.prix.toFixed(2)} €</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                commande.status === 'En attente' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : commande.status === 'Validée' 
                                  ? 'bg-green-100 text-green-800'
                                  : commande.status === 'Annulée'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {commande.status}
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <button 
                                className="text-custom-dark hover:text-blue-600 transition-colors mr-2"
                                onClick={() => openEditModal(commande.bonCommandeId)}
                                title="Modifier la commande"
                              >
                                <FaEdit />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 mt-8 justify-between">
                  <Bouton
                    text="Retour"
                    colorClass="bg-white"
                    hoverColorClass="hover:bg-gray-100 hover:text-custom-dark"
                    onClick={() => window.history.back()}
                  />
                  
                  <Bouton
                    text="Nouvelle commande"
                    colorClass="bg-custom-dark text-white"
                    hoverColorClass="hover:bg-white hover:text-custom-dark"
                    onClick={() => setActiveTab('creation')}
                    childrenIcon={<FaPlus className="ml-2 mt-1" />}
                  />
                </div>
              </div>
            )}
          </div>
        </EncartForm>
      </div>
      
      <EditCommandeModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        commandeId={selectedCommande}
        onCommandeUpdated={handleCommandeUpdated}
      />
    </div>
  );
}