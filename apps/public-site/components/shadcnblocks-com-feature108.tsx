"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Badge } from "@/src/presentation/components/ui/badge";
import { Layout, Eye, HeartHandshake, PhoneCall, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TabContent {
  badge: string;
  title: string;
  description: string | string[];
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface FeatureGrotaProps {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
  backgroundImage?: string;
}

const FeatureGrota = ({
  badge = "Grota Financiamentos",
  heading = "Missão, Visão e Valores",
  description = "Construindo confiança e transparência no crédito automotivo.",
  backgroundImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1950&q=80",
  tabs = [
    {
      value: "missao",
      icon: <Layout className="h-auto w-5 shrink-0" />,
      label: "Missão",
      content: {
        badge: "Compromisso",
        title: "Oferecer soluções financeiras ágeis e seguras",
        description:
          "Conectamos clientes, concessionárias e instituições financeiras com transparência, ética e excelência no atendimento.",
      },
    },
    {
      value: "visao",
      icon: <Eye className="h-auto w-5 shrink-0" />,
      label: "Visão",
      content: {
        badge: "Futuro",
        title: "Ser referência regional em crédito automotivo",
        description:
          "Reconhecida pela confiança, solidez e inovação, ampliando continuamente parcerias e oportunidades para clientes e lojistas.",
      },
    },
    {
      value: "valores",
      icon: <HeartHandshake className="h-auto w-5 shrink-0" />,
      label: "Valores",
      content: {
        badge: "Princípios",
        title: "Nossos valores essenciais",
        description: [
          "Ética e Transparência – Clareza e responsabilidade em todas as negociações.",
          "Compromisso com o Cliente – As melhores condições sempre em primeiro lugar.",
          "Parcerias Duradouras – Relações de confiança com lojistas e instituições financeiras.",
          "Inovação e Agilidade – Processos modernos que simplificam e aceleram o financiamento.",
          "Credibilidade – Mais de 30 anos de experiência garantindo segurança em cada operação.",
        ],
      },
    },
  ],
}: FeatureGrotaProps) => {
  return (
    <section
      className="py-20 px-6 rounded-3xl relative overflow-hidden mt-5 mb-5 mr-5 ml-5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-[#2C2C2C]/80"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header com animação */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6 text-center px-2 md:px-0"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {heading}
          </h1>
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl lg:text-2xl max-w-3xl leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue={tabs[0].value} className="mt-12">
          <TabsList className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-5 py-3 text-base sm:text-lg font-semibold text-white 
                border border-white/20 transition-all
                hover:bg-white/10
                data-[state=active]:bg-white data-[state=active]:text-[#1B4B7C]"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Conteúdo */}
          <div className="mx-auto mt-10 max-w-screen-lg rounded-2xl bg-white shadow-lg p-6 sm:p-8 lg:p-16 min-h-[24rem]">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="flex flex-col gap-6 text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge
                    variant="outline"
                    className="w-fit mx-auto lg:mx-0 bg-[#1B4B7C]/10 text-[#1B4B7C] border-[#1B4B7C]/30"
                  >
                    {tab.content.badge}
                  </Badge>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mt-4 text-[#1B4B7C] leading-tight">
                    {tab.content.title}
                  </h3>

                  {Array.isArray(tab.content.description) ? (
                    <ul className="list-disc text-left space-y-2 text-[#2C2C2C] mb-5 lg:text-lg mt-4 pl-6 sm:pl-8">
                      {tab.content.description.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#2C2C2C] lg:text-lg mt-4 leading-relaxed mb-5">
                      {tab.content.description}
                    </p>
                  )}
                </motion.div>

              </TabsContent>
            ))}
            <Link target="_blank" href="https://api.whatsapp.com/send?phone=551937220914&text=Ol%C3%A1!%20Tudo%20bem%3F%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20finaciamento%20de%20ve%C3%ADculos.">
            <button className="group bg-[#1B4B7C] hover:bg-[#1B4B7C]/90 cursor-pointer text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <PhoneCall className="w-6 h-6 animate-phone-ring" />
              Fale com a nossa equipe
            </button>
            </Link>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { FeatureGrota };
