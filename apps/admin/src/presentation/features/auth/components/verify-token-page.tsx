"use client"

import { VerifyTokenPageProps } from "@/application/core/@types/auth/Props/VerifyTokenPageProps"
import type React from "react"

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#1B4B7C]/50 transition-colors focus-within:border-[#1B4B7C]/80">
    {children}
  </div>
)

export const VerifyTokenPage: React.FC<VerifyTokenPageProps> = ({
  title = <span className="font-light text-[#1B4B7C] tracking-tighter text-4xl md:text-5xl">Verificar Token</span>,
  description = "Digite o código de verificação enviado ao seu e-mail",
  heroImageSrc,
  onVerifyToken,
  onBackToSignIn,
}) => {
  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-sans w-[100dvw] bg-white">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 font-semibold leading-tight">{title}</h1>
            <p className="animate-element animate-delay-200 text-[#1B4B7C]/80">{description}</p>
            <form className="space-y-5" onSubmit={onVerifyToken}>
              <div className="animate-element animate-delay-300">
                <label className="text-md font-medium text-[#1B4B7C]">Código de Verificação</label>
                <GlassInputWrapper>
                  <input
                    name="token"
                    type="text"
                    placeholder="Digite o código aqui"
                    className="w-full bg-white text-[#1B4B7C] placeholder:text-[#1B4B7C]/50 text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-400 w-full rounded-2xl bg-[#1B4B7C] py-4 font-medium text-white hover:bg-[#0F2C55] transition-colors"
              >
                Verificar Token
              </button>
            </form>

            <p className="animate-element animate-delay-500 text-center text-sm text-[#1B4B7C]/80">
              Lembrou sua senha?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onBackToSignIn?.()
                }}
                className="text-[#1B4B7C] hover:underline transition-colors"
              >
                Voltar para Entrar
              </a>
            </p>

            <div className="animate-element animate-delay-600 rounded-2xl border border-[#1B4B7C]/50 bg-[#1B4B7C]/5 p-4">
              <p className="text-sm text-[#1B4B7C]/80">
                <strong className="text-[#1B4B7C]">Nota:</strong> O código de verificação é válido por alguns minutos. Verifique seu e-mail e digite corretamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          ></div>
        </section>
      )}
    </div>
  )
}
