import InflectedCard from "@/components/inflected-card";
import React from "react";

import { FaHandshake, FaSmile } from "react-icons/fa";

const InflectedCardDemo = () => (
    <section>
        <div className="bg-[#f8f8fa] min-h-[300px] flex flex-wrap gap-8 items-center justify-center relative p-10 rounded-lg mt-10">
            {/* Card 1: Transparência */}
            <InflectedCard
                id="1"
                image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                title="Missão"
                description="Oferecer soluções financeiras ágeis e seguras em financiamentos de veículos, conectando clientes, concessionárias e instituições financeiras com transparência, ética e excelência no atendimento."
                tags={[
                    { name: "", textColor: "#", backgroundColor: "#", rounding: 5 },
                ]}
                parentBackgroundColor="#f8f8fa"
                buttonIcon={<FaHandshake />}
                buttonIconSize={32}
                buttonIconColor="#ffffff"
                buttonIconHoverColor="#f8f8fa"
                buttonBackgroundColor="#f97316"
                buttonBackgroundHoverColor="#f97316"
                price=""
                titleColor="#181818"
                descriptionColor="#565656"
                titleAlignment="center"
                descriptionAlignment="center"
                tagsAlignment="center"
                cardRounding={15}
                imageHoverScale={1.1}
                maxWidth="400px"
            />

            {/* Card 1: Transparência */}
            <InflectedCard
                id="1"
                image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                title="Visão"
                description="Ser referência regional em crédito automotivo, reconhecida pela confiança, solidez e inovação, ampliando continuamente parcerias e oportunidades para clientes e lojistas."
                tags={[
                    { name: "", textColor: "#181818", backgroundColor: "#", rounding: 5 },
                ]}
                parentBackgroundColor="#f8f8fa"
                buttonIcon={<FaHandshake />}
                buttonIconSize={32}
                buttonIconColor="#f8f8fa"
                buttonIconHoverColor="#f8f8fa"
                buttonBackgroundColor="#f97316"
                buttonBackgroundHoverColor="#f97316"
                price="Aprenda mais"
                titleColor="#181818"
                descriptionColor="#565656"
                titleAlignment="center"
                descriptionAlignment="center"
                tagsAlignment="center"
                cardRounding={15}
                imageHoverScale={1.1}
                maxWidth="400px"
            />



            {/* Card 3: Suporte completo */}
            <InflectedCard
                id="3"
                image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                title="Valores"
                description="Acompanhamento do início ao fim do financiamento, com atendimento humanizado e suporte personalizado."
                tags={[
                    { name: "", textColor: "#fff", backgroundColor: "#", rounding: 5 },
                ]}
                parentBackgroundColor="#f8f8fa"
                buttonIcon={<FaSmile />}
                buttonIconSize={32}
                buttonIconColor="#fff"
                buttonIconHoverColor="#f8f8fa"
                buttonBackgroundColor="#f97316"
                buttonBackgroundHoverColor="#f97316"
                price="Fale conosco"
                titleColor="#181818"
                descriptionColor="#565656"
                titleAlignment="center"
                descriptionAlignment="center"
                tagsAlignment="center"
                cardRounding={15}
                imageHoverScale={1.1}
                maxWidth="400px"
            />
        </div>
    </section>
);

export { InflectedCardDemo };
