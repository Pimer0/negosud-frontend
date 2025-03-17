'use client';
import EncartForm from "@/components/EncartForm";
import InfoBulle from "@/components/infoBulle";
import Bouton from "@/components/Bouton";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { validateCode } from "@/services/api/ClientAuth";

export default function EmailValidation() {
    const router = useRouter();
    const [error, setError] = useState<{ message?: string; code?: string }>({});
    const [formData, setFormData] = useState({
        email: '',
        code: ''
    });
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError({});
        setSuccess(false);

        try {
            // Appel du service pour valider le code
            await validateCode({
                email: formData.email,
                code: formData.code
            });

            setSuccess(true);
            // Rediriger l'utilisateur après une validation réussie
            setTimeout(() => {
                router.push('/');
            }, 2000); // Redirection après 2 secondes
} catch (err) {
    const error = err as { response?: { data?: { message?: string; errors?: { code?: string[] } } } };
    setError({
        message: error.response?.data?.message || 'Une erreur est survenue lors de la validation.',
        code: error.response?.data?.errors?.code?.[0] // Si l'API renvoie une erreur spécifique pour le code
    });
    console.error(err);
}
    };

    return (
        <EncartForm titre={"Validez votre mail"}>
            <form onSubmit={onSubmit}>
                <div className={"flex flex-col gap-4"}>

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />



                        <label htmlFor="code">Code de validation</label>
                        <input
                            type="text"
                            name="code"
                            id="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                        {error.code && (
                            <InfoBulle
                                colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                                content={error.code}
                            />
                        )}

                </div>

                {error.message && (
                    <InfoBulle
                        colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"}
                        content={error.message}
                    />
                )}
                {success && (
                    <InfoBulle
                        colorClass={"bg-[#DCFCE7] border-[#022C22] text-[#022C22]"}
                        content={"Compte validé ! Redirection..."}
                    />
                )}

                <div className={"flex flex-row-reverse gap-3 mt-6"}>
                    <Bouton
                        colorClass={"bg-[#1E4147] text-white"}
                        hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
                        text={"Valider mon code"}
                        customType="submit"
                    />
                    <Bouton
                        text={"Retour"}
                        onClick={() => router.push('/')}
                    />
                </div>
            </form>
        </EncartForm>
    );
}