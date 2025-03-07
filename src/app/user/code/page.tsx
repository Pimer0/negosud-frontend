'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import InfoBulle from "@/components/infoBulle";
import Cookies from 'js-cookie';

export default function Code() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    const validateCode = (code: string) => {
        if (code === "ilovewine") {
            // Définir un cookie `CookieCode` valide pendant 7 jours
            Cookies.set('CookieCode', 'true', {
                expires: 7,
                secure: true,
                sameSite: 'lax',
                path: '/',
            });
            router.push("/user/login");
        } else {
            setError("Mauvais code, réessayez");
            setInput("");
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className={"p-4 m-4 bg-white rounded-lg max-w-2xl"}>
                    <h1 className={"font-bold"}>Saisissez votre combinaison secrete</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                {error && <InfoBulle colorClass={"bg-[#FECACA] text-[#450A0A] border-[#450A0A]"} content={error} />}
                <textarea
                    className={'opacity-0'}
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)} // Mettre à jour l'état sans valider
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            e.preventDefault();
                            validateCode(input); // Valider uniquement lors de l'appui sur "Entrée"
                        }
                    }}
                ></textarea>
            </main>
        </div>
    );
}