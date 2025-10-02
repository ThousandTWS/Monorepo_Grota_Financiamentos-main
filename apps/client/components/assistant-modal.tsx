/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type FC, forwardRef, useEffect, useRef } from "react";
import { AssistantModalPrimitive } from "@assistant-ui/react";

import { Thread } from "@/components/thread";
import { TooltipIconButton } from "@/components/tooltip-icon-button";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import chatAnimation from "@/components/lottie/UjjHSCy8Kl.json";

export const AssistantModal: FC = () => {
  return (
    <AssistantModalPrimitive.Root>
      {/* Botão flutuante posicionado acima do WhatsApp */}
      <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor fixed right-5 bottom-24 size-[4rem] z-[100]">
        <AssistantModalPrimitive.Trigger asChild>
          <AssistantModalButton />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>

      {/* Janela do Assistente */}
      <AssistantModalPrimitive.Content
        sideOffset={16}
        className="
          aui-root aui-modal-content z-50 h-[520px] w-[650px] overflow-hidden
          rounded-2xl border border-blue-200
          bg-gradient-to-br from-white via-blue-50 to-blue-100
          p-0 text-white shadow-2xl outline-none
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:zoom-in
          [&>.aui-thread-root]:bg-[#F8FAFC]
        "
      >
        <Thread />
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>
  );
};

type AssistantModalButtonProps = { "data-state"?: "open" | "closed" };

const AssistantModalButton = forwardRef<
  HTMLButtonElement,
  AssistantModalButtonProps
>(({ "data-state": state, ...rest }, ref) => {
  const tooltip =
    state === "open" ? "Fechar Assistente Grota" : "Abrir Assistente Grota";

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Controla animação Lottie conforme o estado do modal
  useEffect(() => {
    if (!lottieRef.current) return;

    if (state === "open") {
      lottieRef.current.setSpeed(1);
      lottieRef.current.playSegments([0, 60], true); 
    } else {
      lottieRef.current.setSpeed(1);
      lottieRef.current.playSegments([60, 0], true); 
    }
  }, [state]);

  return (
    <TooltipIconButton
      variant="default"
      tooltip={tooltip}
      side="left"
      {...rest}
      ref={ref}
      className="
        size-full rounded-full
        bg-gradient-to-br from-[#1B4B7C] to-[#1D6094]
        text-white
        shadow-2xl shadow-[#1B4B7C]/40
        hover:scale-110 hover:from-[#1D6094] hover:to-[#1F74AC]
        active:scale-95
        transition-all duration-200
      "
    >
      {/* Lottie animado */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Lottie
          lottieRef={lottieRef}
          animationData={chatAnimation}
          loop={true}
          className="w-10 h-10 text-white"
        />
      </div>

      <span className="aui-sr-only sr-only">{tooltip}</span>
    </TooltipIconButton>
  );
});

AssistantModalButton.displayName = "AssistantModalButton";
