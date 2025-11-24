import Image from "next/image";

export default function LogoCloud() {
    return (
        <section className="bg-background py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-lg font-medium">Your favorite companies are our partners.</h2>
                <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                    <Image className="h-5 w-fit dark:invert" src="https://res.cloudinary.com/dx1659yxu/image/upload/v1759428329/Logotipo_bancos_10_qwqsyy.svg" alt="Nvidia Logo" height={20} width={20} />
                   
                </div>
            </div>
        </section>
    )
}