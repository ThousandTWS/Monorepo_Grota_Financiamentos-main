"use client";

import React, { useRef } from "react";

function Financiamentos() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [availableHeight, setAvailableHeight] = React.useState<number>();

  React.useEffect(() => {
    const updateHeight = () => {
      if (!sectionRef.current) return;

      const { top } = sectionRef.current.getBoundingClientRect();
      const parentElement = sectionRef.current.parentElement;
      const parentStyles = parentElement
        ? window.getComputedStyle(parentElement)
        : null;
      const parentBottomPadding = parentStyles
        ? parseFloat(parentStyles.paddingBottom) || 0
        : 0;

      setAvailableHeight(window.innerHeight - top + parentBottomPadding);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="-mx-4 -mt-4 -mb-4 flex flex-1 flex-col overflow-hidden md:-mx-6 md:-mt-6 md:-mb-6"
      style={{
        height: availableHeight ? `${availableHeight}px` : undefined,
      }}
    >
      <iframe
        src="https://shopcred.conect.com.br/grota-financiamentos"
        title="Simulador de Financiamentos"
        className="h-full w-full flex-1 border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    </section>
  );
}

export default Financiamentos;
