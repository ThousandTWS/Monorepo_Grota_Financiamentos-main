"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Lock,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/presentation/components/ui/input-otp";
import api from "@/application/services/server/api";
import { VerificationType } from "@/application/core/@types/verification.type";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup } from "../shared/InputGroups";
import clsx from "clsx";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string | null;
  type: VerificationType | null;
}

interface Message {
  message: string;
  type: "ERROR" | "SUCCESS";
}

const verificationSchema = z.object({
  code: z.string().length(6, "Formato do código inválido"),
});

const redefineSchema = verificationSchema.extend({
  newPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(50, "A senha deve ter no máximo 50 caracteres"),
});

export type VerificationFormData = {
  code: string;
  newPassword?: string;
};

export function VerificationModal({
  isOpen,
  onClose,
  email,
  type,
}: VerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const schema =
    type === VerificationType.REDEFINE_CODE
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
      onClose();
      setMessage(null);
      reset();
      const event = new CustomEvent("openLoginModal");
      window.dispatchEvent(event);
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

  const handleResendToken = async (type: VerificationType) => {
    setIsLoading(true);
    setMessage(null);

    try {
      let response;

      if (type === VerificationType.CONFIRM_CODE) {
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

    if (type === VerificationType.CONFIRM_CODE) {
      await handleVerifyToken(data);
    } else {
      await handleResetPassword(data);
    }
  };

  if (!isOpen) return null;

  const inputStyle = `w-full pl-10 pr-4 py-3 
    border-2 rounded-xl 
    transition-all duration-200
    placeholder:text-gray-400 
    focus:outline-none focus:ring-2
    focus:border-blue-700 focus:ring-blue-200 focus:text-black
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${Object.keys(errors).length > 0 ? "border-red-400" : "border-gray-200"}
  `;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={clsx(
          "bg-white rounded-3xl shadow-2xl w-full relative p-8 sm:p-10",
          type === VerificationType.REDEFINE_CODE ? "max-w-xl" : "max-w-md"
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-blue-700 transition-colors z-10 p-2 rounded-full hover:bg-gray-100"
          aria-label="Fechar Modal de Verificação"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <Mail size={40} className="mx-auto text-blue-700 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verificação por E-mail
          </h2>
          <p className="text-gray-600 text-sm">
            Enviamos um código de 6 dígitos para{" "}
            <span className="font-semibold text-gray-800">{email}</span>.
            Insira-o abaixo para ativar sua conta.
          </p>
        </div>

        {message && (
          <div
            className={clsx(
              "mb-6 p-4 border rounded-lg font-medium text-sm",
              message.type === "SUCCESS"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800 flex items-start gap-3"
            )}
          >
            {message.type === "SUCCESS" ? (
              <span className="text-sm font-medium">{message.message}</span>
            ) : (
              <>
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{message.message}</span>
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-end relative">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <InputOTP
                  {...field}
                  maxLength={6}
                  disabled={isLoading}
                  className={inputStyle}
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
              className="mt-4 mr-2 flex items-center gap-2 text-sm md:text-base text-blue-700 hover:text-blue-800 font-medium hover:cursor-pointer disabled:opacity-50"
              disabled={isLoading}
              onClick={() => handleResendToken(type!)}
            >
              <RefreshCcw size={18} />
              Reenviar Código
            </button>

            {type === VerificationType.REDEFINE_CODE && (
              <div className="w-full mt-4">
                <InputGroup
                  id="newPassword"
                  label="Nova Senha"
                  icon={<Lock size={20} />}
                  error={errors.newPassword}
                >
                  <input
                    type="password"
                    id="newPassword"
                    {...register("newPassword")}
                    className={inputStyle}
                    placeholder="Mínimo 8 caracteres"
                    disabled={isLoading}
                  />
                </InputGroup>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirmar Código
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
