'use client';

import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";
import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import EncartForm from "@/components/EncartForm";
import { ValidationErrorsUtilisateurs} from "@/interfaces/ValidationsErrors";
import { fetchWithSessionUser } from "@/lib/fetchWithSession";
import { Role } from "@/interfaces/Role";


export default function ModificationUtilisateur() {
    const router = useRouter();
    const params = useParams();
    const [errors, /*setErrors*/] = useState<ValidationErrorsUtilisateurs>({});
    const [success, setSuccess] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        utilisateurId: 0,
        email: '',
        nom: '',
        prenom: '',
        roleId: 0,
        role: '',
    });


    useEffect(() => {
        if (params.slug) {
            const utilisateurId = parseInt(params.slug as string, 10);
            setFormData(prevState => ({
                ...prevState,
                utilisateurId,
            }));


            const fetchUtilisateur = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:5141/api/Utilisateur/${utilisateurId}`);
                    const data = await response.json();
                    if (data.success) {
                        setFormData(prevState => ({
                            ...prevState,
                            email: data.data.email || '',
                            nom: data.data.nom || '',
                            prenom: data.data.prenom || '',
                            roleId: data.data.roleId || 0,
                            role: data.data.role || '',
                        }));
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données de l'utilisateur", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUtilisateur();
            fetchRoles();
        }
    }, [params.slug]);

    const fetchRoles = async () => {
        const response = await fetchWithSessionUser('/api/Role');
        if (response.success) {
            setRoles(response.data);
        } else {
            console.error("Erreur lors de la récupération des rôles", response.message);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'roleId') {
          const roleIdValue = parseInt(value, 10);
          const selectedRole = roles.find(role => role.roleId === roleIdValue);
          
          setFormData(prevState => ({
            ...prevState,
            roleId: roleIdValue,
            role: selectedRole ? selectedRole.nom : '',
          }));
        } else {
          setFormData(prevState => ({
            ...prevState,
            [name]: value,
          }));
        }
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        try {
          const response = await fetchWithSessionUser(`/api/Utilisateur/${formData.utilisateurId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          if (response.success) {
            setSuccess(true);
            console.log("Utilisateur modifié avec succès");
            router.push("/user/gestion-utilisateurs");
          } else {
            console.error("Erreur lors de la modification", response.message);
          }
        } catch (error) {
          console.error("Erreur lors de la modification", error);
        }
      };

    // Ne pas afficher le formulaire pendant le chargement
    if (isLoading) {
        return (
            <EncartForm titre={"Modifiez un utilisateur"}>
                <div>Chargement des données...</div>
            </EncartForm>
        );
    }

    return (
        <EncartForm titre={"Modifiez un utilisateur"}>
            <form onSubmit={handleSubmit}>
                <div className={"flex flex-col"}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.email && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.email[0]}
                        />
                    )}
                </div>

                <div className={"flex flex-col"}>
                    <label htmlFor="nom">Nom</label>
                    <input
                        type="text"
                        name="nom"
                        id="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.nom && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.nom[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label htmlFor="prenom">Prénom</label>
                    <input
                        type="text"
                        name="prenom"
                        id="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.prenom && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.prenom[0]}
                        />
                    )}
                </div>
                <div className={"flex flex-col"}>
                    <label htmlFor="roleId">Rôle</label>
                    <select
                        name="roleId"
                        id="roleId"
                        value={formData.roleId}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded"
                    >
                        <option value="">Sélectionnez un rôle</option>
                        {roles.map(role => (
                            <option key={role.roleId} value={role.roleId}>
                                {role.nom}
                            </option>
                        ))}
                    </select>
                    {errors.errors?.roleId && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.roleId[0]}
                        />
                    )}
                </div>
                {/* <div className={"flex flex-col"}>
                    <label htmlFor="role">Rôle</label>
                    <input
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                    {errors.errors?.role && (
                        <InfoBulle
                            colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                            content={errors.errors?.role[0]}
                        />
                    )}
                </div> */}
                <div className={"flex flex-row justify-center gap-4 mt-8"}>
                    <Bouton
                        text={"Retour"}
                        onClick={() => router.back()}
                    />
                    <Bouton
                        text={"Modifier"}
                        colorClass={"bg-[#1E4147] text-white"}
                        hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        customType={"submit"}
                    />
                </div>
            </form>
            {success && (
                <InfoBulle
                    colorClass={"bg-[#DCFCE7] border-[#022C22]"}
                    content={"Données modifiées avec succès !"}
                />
            )}
        </EncartForm>
    );
}