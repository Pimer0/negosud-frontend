'use client'

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import EncartForm from "@/components/EncartForm";
import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";

// Define types for the data structure
type Commande = {
    commandeId: number;
    dateCreation: string;
    expirationDate: string;
    valide: boolean;
    factureId?: number | null;
    clientId: number;
    livraisonId: number | null;
    deletedAt: string | null;
    client: Record<string, unknown> | null;
    facture: Facture | null;
    factureNavigation: Record<string, unknown> | null;
    ligneCommandes: Array<Record<string, unknown>>;
    livraison: Record<string, unknown> | null;
    reglements: Array<Record<string, unknown>>;
};

type Facture = {
    factureId: number;
    dateFacture: string;
    montantTotal: number;
    commandeId?: number;
};

type Adresse = {
    rue: string;
    codePostal: string;
    ville: string;
    pays: string;
};

type ClientData = {
    clientId: number;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    estValide: boolean;
    adresses: Adresse[];
    commandes: Commande[];
    factures: Facture[];
};

export default function ProfilClient() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.slug;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clientData, setClientData] = useState<ClientData>({
        clientId: 0,
        nom: "",
        prenom: "",
        email: "",
        tel: "",
        estValide: false,
        adresses: [],
        commandes: [],
        factures: []
    });

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true);
            try {
                if (!clientId) {
                    setError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre profil.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5141/api/Client/${clientId}`);
                const result = await response.json();

                if (result.data) {
                    const data = {
                        clientId: result.data.clientId,
                        nom: result.data.nom,
                        prenom: result.data.prenom,
                        email: result.data.email,
                        tel: result.data.tel,
                        estValide: result.data.estValide,
                        adresses: result.data.adresses || [],
                        commandes: result.data.commandes || [],
                        factures: result.data.factures || []
                    };
                    setClientData(data);
                    console.log("Client data apres fetch:", data)
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données client", error);
                setError("Une erreur est survenue lors de la récupération de vos informations");
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
        console.log(clientData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId]);


    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "Date invalide";
        }
    };


    const calculateTimeRemaining = (expirationDate: string): string => {
        const now = new Date();
        const expDate = new Date(expirationDate);

        if (isNaN(expDate.getTime())) {
            return "Date d'expiration invalide";
        }

        if (now > expDate) {
            return "Expirée";
        }

        const diffMs = expDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours > 0) {
            return `${diffHours}h ${diffMins % 60}min`;
        }
        return `${diffMins}min`;
    };


    const getCommandeStatus = (commande: Commande) => {
        if (commande.valide) {
            return {status: "Validée", color: "text-green-600"};
        } else if (!commande.valide) {
            const now = new Date();
            const expDate = new Date(commande.expirationDate);

            if (now > expDate) {
                return {status: "Expirée", color: "text-red-600"};
            } else {
                return {status: "En attente", color: "text-yellow-600"};
            }
        }
        return {status: "Inconnue", color: "text-gray-600"};
    };

    return (
        <EncartForm titre={"Mon Profil"}>
            {loading ? (
                <div className="flex justify-center py-8">
                    <p>Chargement de vos informations...</p>
                </div>
            ) : error ? (
                <InfoBulle
                    colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                    content={error}
                />
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">Nom</span>
                            <span className="text-lg">{clientData.nom}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-600">Prénom</span>
                            <span className="text-lg">{clientData.prenom}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-600">Email</span>
                        <span className="text-lg">{clientData.email}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-600">Téléphone</span>
                        <span className="text-lg">{clientData.tel}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-600">Statut du compte</span>
                        <span className={`text-lg ${clientData.estValide ? 'text-green-600' : 'text-red-600'}`}>
                                                    {clientData.estValide ? 'Validé' : 'En attente de validation'}
                                                </span>
                    </div>


                    <div className="mt-6">
                        <h3 className="font-semibold text-xl mb-2">Mes commandes</h3>
                        {clientData.commandes && clientData.commandes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {clientData.commandes.map((commande, index) => {
                                    const commandeStatus = getCommandeStatus(commande);
                                    return (
                                        <div key={index} className="border p-4 rounded-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-medium">Commande #{commande.commandeId}</p>
                                                <span className={`font-medium ${commandeStatus.color}`}>
                                                                            {commandeStatus.status}
                                                                        </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Date de création:</p>
                                                    <p>{formatDate(commande.dateCreation)}</p>
                                                </div>
                                                {!commande.valide && (
                                                    <div>
                                                        <p className="text-gray-600">Expire dans:</p>
                                                        <p>{calculateTimeRemaining(commande.expirationDate)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="border p-4 rounded-md bg-gray-50">
                                <p className="text-gray-600">Aucune commande à afficher</p>
                            </div>
                        )}
                    </div>


                    <div className="mt-6">
                        <h3 className="font-semibold text-xl mb-2">Mes factures</h3>
                        {clientData.factures && clientData.factures.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {clientData.factures.map((facture, index) => (
                                    <div key={index} className="border p-4 rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-medium">Facture #{facture.factureId}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-gray-600">Date:</p>
                                                <p>{formatDate(facture.dateFacture)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Montant:</p>
                                                <p>{facture.montantTotal}€</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border p-4 rounded-md bg-gray-50">
                                <p className="text-gray-600">Aucune facture à afficher</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row justify-center gap-4 mt-8">
                        <Bouton
                            text={"Retour"}
                            onClick={() => router.back()}
                            customType={"button"}
                        />
                    </div>
                </div>
            )}
        </EncartForm>
    );
}