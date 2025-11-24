"use client"

import { VerifyTokenPageProps } from "@/application/core/@types/auth/Props/VerifyTokenPageProps"
import api from "@/application/services/server/api";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/presentation/layout/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react"
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

interface Message {
  message: string;
  type: "ERROR" | "SUCCESS";
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#1B4B7C]/50 transition-colors focus-within:border-[#1B4B7C]/80">
    {children}
  </div>
)

const verificationSchema = z.object({
  code: z.string().length(6, "Formato do código inválido"),
});

const redefineSchema = verificationSchema.extend({
  newPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(50, "A senha deve ter no máximo 50 caracteres"),
});

type VerificationFormData = {
  code: string;
  newPassword?: string;
};

export const VerifyTokenPage: React.FC<VerifyTokenPageProps> = ({
  heroImageSrc,
  tokenType,
  email
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const schema =
    tokenType === "redefinicao-senha"
      ? redefineSchema
      : verificationSchema;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const handleSuccess = () => {
    setMessage({
      message: "Código validado! Você será redirecionado",
      type: "SUCCESS",
    });
    setTimeout(() => {
      setMessage(null);
      reset();
      router.push("/");
    }, 3000);
  };

  const handleVerifyToken = async (data: VerificationFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.put("/auth/verify-code", {
        email,
        code: data.code,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      response.data.success
        ? handleSuccess()
        : setMessage({
            message:
              "Código inválido. Por favor, verifique sua caixa de entrada.",
            type: "ERROR",
          });
    } catch (apiError: any) {
      setMessage({
        message:
          apiError.response?.data?.message ||
          "Erro ao verificar o código. Tente novamente.",
        type: "ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: VerificationFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        code: data.code,
        newPassword: data.newPassword,
      });

      if (response.data.success) handleSuccess();
    } catch (apiError: any) {
      setMessage({
        message:
          apiError.response?.data?.message ||
          "Erro ao verificar o código. Tente novamente.",
        type: "ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendToken = async (type: "verificacao" | "redefinicao-senha") => {
    setIsLoading(true);
    setMessage(null);

    try {
      let response;

      if (type === "verificacao") {
        response = await api.post("/auth/resend-code", { email });
      } else {
        response = await api.post("/auth/forgot-password", { email });
      }

      if (response?.data?.success) {
        setMessage({
          message: "Código reenviado com sucesso!",
          type: "SUCCESS",
        });
      } else {
        setMessage({
          message: "Erro ao reenviar código.",
          type: "ERROR",
        });
      }
    } catch (apiError: any) {
      setMessage({
        message:
          apiError.response?.data?.message ||
          "Erro ao reenviar o código. Tente novamente.",
        type: "ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VerificationFormData) => {
    if (!email) return;

    if (tokenType === "verificacao") {
      await handleVerifyToken(data);
    } else {
      await handleResetPassword(data);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-sans w-[100dvw] bg-white">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 leading-tight font-light text-[#1B4B7C] tracking-tighter text-4xl md:text-5xl">
              {tokenType === "redefinicao-senha" ? "Redefinir Senha" : "Confirmar Código"}
            </h1>
            <p className="animate-element animate-delay-200 text-[#1B4B7C]/80">
              {tokenType === "redefinicao-senha" ? `Informe o código enviado para ${email} abaixo e redefina sua senha` : `Informe abaixo para confirmar o código enviado para seu email ${email}`}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col items-end relative mb-0">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      {...field}
                      maxLength={6}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#1B4B7C] focus:ring-blue-200 focus:text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />

                <button
                  type="button"
                  className="mt-4 mr-2 flex items-center gap-2 text-sm md:text-base text-[#1B4B7C]/90 hover:text-[#1B4B7C] font-medium hover:cursor-pointer disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => handleResendToken(tokenType)}
                >
                  <RefreshCcw size={18} />
                  Reenviar Código
                </button>
              </div>

              {tokenType === "redefinicao-senha" && (
                <div className="animate-element animate-delay-400 w-full">
                  <label className="text-md font-medium text-[#1B4B7C]" htmlFor="newPassword">E-mail</label>
                  <GlassInputWrapper>
                    <input
                      id="newPassword"
                      type="password"
                      {...register("newPassword")}
                      placeholder="Digite sua senha"
                      className="w-full bg-transparent text-black text-sm p-4 rounded-2xl focus:outline-none"
                      disabled={isLoading}
                    />
                  </GlassInputWrapper>

                  {errors.newPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="animate-element animate-delay-400 w-full rounded-2xl bg-[#1B4B7C] py-4 font-medium text-white hover:bg-[#0F2C55] transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    Verificar Token
                  </>
                )}
              </button>
            </form>

            <p className="animate-element animate-delay-500 text-center text-sm text-[#1B4B7C]/80">
              Lembrou sua senha?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/")
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