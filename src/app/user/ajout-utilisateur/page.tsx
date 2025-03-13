'use client';
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import React, { useState } from "react";
import InfoBulle from "@/components/infoBulle";
import { useRouter } from "next/navigation";
import { ValidationErrorsUtilisateurs} from "@/interfaces/ValidationsErrors";

export default function AjoutUtilisateur() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
    nom: "",
    prenom: "",
    access_token: "",
    roleId: 0,
    role: "employe",
  });

  const [errors, setErrors] = useState<ValidationErrorsUtilisateurs>({});
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSuccess(false);

    const url = "http://localhost:5141/api/Utilisateur/register";

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          email: "",
          motDePasse: "",
          nom: "",
          prenom: "",
          access_token: "",
          roleId: 0,
          role: "user",
        });
        router.push("/user/gestion-utilisateurs"); // Redirection après succès
      } else {
        const errorText = await response.text();
        console.log("Réponse d'erreur de l'API:", errorText);
        setErrors({ errors: { general: [errorText || "Erreur lors de l'enregistrement de l'utilisateur."] } });
      }
    } catch (error) {
      setErrors({ errors: { general: ["Erreur lors de la connexion au serveur."] } });
      console.error("Erreur lors de la soumission des données:", error);
    }
  };

  return (
      <EncartForm titre={"Ajouter un utilisateur"}>
        <div className={"flex flex-col"}>
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
                      content={errors.errors.email?.[0]}
                  />
              )}
            </div>
            <div className={"flex flex-col"}>
              <label htmlFor="motDePasse">Mot de passe</label>
              <input
                  type="password"
                  name="motDePasse"
                  id="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required
              />
              {errors.errors?.motDePasse && (
                  <InfoBulle
                      colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                      content={errors.errors.motDePasse?.[0]}
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
                      content={errors.errors.nom?.[0]}
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
                      content={errors.errors.prenom?.[0]}
                  />
              )}
            </div>
            <div className={"flex flex-row justify-center gap-4 mt-8"}>
              <Bouton
                  text={"Retour"}
                  onClick={() => router.back()}
              />
              <Bouton
                  text={"Créer"}
                  colorClass={"bg-[#1E4147] text-white"}
                  hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                  customType={"submit"}
              />
            </div>
          </form>
          {success && (
              <InfoBulle
                  colorClass={"bg-[#DCFCE7] border-[#022C22]"}
                  content={"Utilisateur créé avec succès !"}
              />
          )}
          {errors.errors?.general && (
              <InfoBulle
                  colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                  content={errors.errors.general?.[0]}
              />
          )}
        </div>
      </EncartForm>
  );
}