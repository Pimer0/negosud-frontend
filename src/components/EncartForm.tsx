import {EncartFormProps} from "@/interfaces/EncartFormProps";
import {barlowCondensed} from "@/app/fonts";

const EncartForm: React.FC<EncartFormProps>= ({children, titre, customWidth}) => {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
        <div >
            <h1 className={`font-bold ${barlowCondensed.className} leading-none mb-3`}>{titre}</h1>
            <div className={`bg-white h-fit rounded-lg p-4 ${customWidth} flex flex-wrap content-center items-center justify-center`}>
                {children}
            </div>
        </div>
        </main>
        </div>
    )
}

export default EncartForm;