"use client";

import { type FC, forwardRef, useEffect, useRef, useState } from "react";
import { AssistantModalPrimitive } from "@assistant-ui/react";

import { Thread } from "@/components/thread";
import { TooltipIconButton } from "@/components/tooltip-icon-button";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import chatAnimation from "@/components/lottie/UjjHSCy8Kl.json";

export const AssistantModal: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <AssistantModalPrimitive.Root open={open} onOpenChange={setOpen}>
      <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor fixed right-5 bottom-24 size-[4rem] z-[100]">
        <AssistantModalPrimitive.Trigger asChild>
          <AssistantModalButton />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>

      <AssistantModalPrimitive.Content
        sideOffset={56}
        className="
          relative
          aui-root aui-modal-content  right-6  z-[110]
          h-[420px] w-[450px] overflow-hidden
          rounded-2xl border border-blue-200
          bg-gradient-to-br from-white via-blue-50 to-blue-100
          p-0 text-white shadow-2xl outline-none
          data-[state=closed]:animate-out data-[state=open]:animate-in
          [&>.aui-thread-root]:bg-[#F8FAFC]
        "
      >
       
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          className="absolute right-5 top-3 z-[120] pointer-events-auto rounded-full p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          aria-label="Fechar"
        >
          ✕
        </button>

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
