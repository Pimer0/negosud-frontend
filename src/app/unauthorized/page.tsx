'use client'

import Bouton from "@/components/Bouton";
import {useRouter} from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <div className="bg-white p-8 rounded-lgmax-w-md w-[700px]">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
                <p className="text-gray-700 mb-6">
                    Votre session a expiré ou vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page.
                </p>
                <div className="flex justify-center">
                    <Bouton
                        text={"Connexion"}
                        onClick={() => router.push("/user/code")}
                    />
                </div>
            </div>
        </div>
    );
}