'use client';
import EncartForm from "@/components/EncartForm";
import Bouton from "@/components/Bouton";
import {FormEvent} from "react";
import Link from "next/link";


export default function Login() {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

    }
    return (
<EncartForm titre={"Connectez-vous"} customWidth={"w-[614px]"}>
    <form onSubmit={onSubmit}>
        <div className={"flex flex-col"}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email"/>
        </div>

        <Bouton
            colorClass={"bg-[#1E4147] text-white"}
            hoverColorClass={"hover:bg-white hover:text-[#1E4147]"}
            text={"Connexion"}/>
        <Link className={`underline text-[#1E414] leading-none mb-3 mt-6`} href={"/admin/login"}>Vous êtes un administrateur du site ?</Link>
    </form>
</EncartForm>
    )
}