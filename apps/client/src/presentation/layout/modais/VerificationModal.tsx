"use client";

import { useState } from "react";
import {
  X,
  Mail,
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

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string | null;
}

export function VerificationModal({
  isOpen,
  onClose,
  email,
}: VerificationModalProps) {
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length !== 6) {
      setError("O código deve ter 6 dígitos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put("/auth/verify-code", {
        email,
        code: token,
      });

      if (response.data.success) {
        setSuccess("Código validado! Você será redirecionado.");

        setTimeout(() => {
          onClose();
          setSuccess("");
          setToken("");
          const event = new CustomEvent("openLoginModal");
          window.dispatchEvent(event);
        }, 3000);
      } else {
        setError("Código inválido. Por favor, verifique sua caixa de entrada.");
      }
    } catch (apiError: any) {
      setError(
        apiError.response?.data?.message ||
          "Erro ao verificar o código. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative p-8 sm:p-10">
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

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-800 font-medium text-sm">
            {success}
          </div>
        )}

        {error && token.length !== 0 && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3 text-red-800">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifyToken} className="space-y-6">
          <div className="flex flex-col items-end relative">
            <InputOTP
              maxLength={6}
              value={token}
              onChange={(value) => setToken(value)}
              disabled={isLoading}
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

            <button
              type="button"
              className="mt-4 mr-2 flex items-center gap-2 text-sm md:text-base text-blue-700 hover:text-blue-800 font-medium hover:cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCcw size={18} />
              Reenviar Código
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || token.length !== 6}
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
