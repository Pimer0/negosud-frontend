import Link from 'next/link';
import Image from "next/image";
import {liensHeaderClient} from "@/Utils/liensHeaderClient";
import {FiShoppingCart} from "react-icons/fi";
import {FaRegUser} from "react-icons/fa";

                const HeaderClient: React.FC = ({style =  "flex row text-[#1E4147] active:underline active:underline-offset-4 focus:underline focus:underline-offset-4 hover:underline hover:underline-offset-4"}) => {


return (
                                 <header className={"flex items-center justify-between p-4"}>
                                     <Image className={"left-0"} src="/Nsud.png" alt="logo" width={80} height={20}/>
                                     <div className={"flex-grow flex justify-center gap-5"}>
                                         {liensHeaderClient.map((lien, index) => (
                                             <Link className={style} key={index} href={lien.pathname}>
                                                 {lien.text}
                                             </Link>
                                         ))}
                                     </div>
                                     <div className={"flex justify-center gap-5"}>
                                         <Link className={style} href={"/panier"}><FiShoppingCart color={"#1E4147"} style={{ marginRight: '0.5rem' }}/>Panier 0</Link>
                                         <Link className={style} href={"/compte"}><FaRegUser color={"#1E4147"} style={{ marginRight: '0.5rem' }}/>Compte</Link>
                                     </div>
                                 </header>
                             );
                }
                export default HeaderClient;