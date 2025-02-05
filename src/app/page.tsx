
import Bouton from "@/components/Bouton";
import Encart from "@/components/Encart";
import {GoArrowUpRight} from "react-icons/go";
import Carrousel from "@/components/Carrousel";



export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
<div className="flex flex-row max-w-[804px]">
    <Encart titre={"On a le meilleur vin."} corps={"Pour en avoir le coeur net, la suite c’est ici:"} customWidth={"w-[250px]"}>
        <Bouton text={"Au shop"} childrenIcon={<GoArrowUpRight color="#1E4147" />} />
    </Encart>
    <Encart customWidth={"w-[60%]"} titre={"Besoin d’un guide ?"} corps={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}/>
</div>
          <Carrousel />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>Pimer & Yoyo all rights reserved - 2025</p>
      </footer>
    </div>
  );
}
