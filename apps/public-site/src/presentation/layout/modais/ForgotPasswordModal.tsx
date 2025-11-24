"use client";

import { useState } from "react";
import { X, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/src/application/services/auth/hooks/useAuth";
import { VerificationType } from "@/application/core/@types/verification.type";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess("");

    if (!email) {
      return;
    }

    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose();
        setSuccess("");
        setEmail("");
        const event = new CustomEvent("openVerificationModal", {
          detail: {
            email,
            verification_type: VerificationType.REDEFINE_CODE,
          },
        });
        window.dispatchEvent(event);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Esqueceu sua senha?
            </h2>
            <p className="text-gray-600">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-md font-medium text-gray-700 mb-5">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-600 text-black"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer disabled:bg-blue-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Instruções"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  const event = new CustomEvent("openLoginModal");
                  window.dispatchEvent(event);
                }, 100);
              }}
              disabled={isLoading}
              className="text-md text-blue-500 hover:text-blue-600 cursor-pointer disabled:text-orange-300"
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
