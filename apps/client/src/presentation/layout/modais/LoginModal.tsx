"use client";

import { useState } from "react";
import { X, Lock, AlertCircle, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/src/application/services/auth/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup } from "../shared/InputGroups";

const LOGISTA = (
  process.env.NEXT_PUBLIC_LOGISTA_PANEL_URL ?? "http://localhost:3002"
).replace(/\/$/, "");

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    setSuccess("");

    if (!data.email || !data.password) {
      return;
    }

    const result = await signIn(data);
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose();
        window.location.href = LOGISTA;
      }, 1500);
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
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-blue-700 transition-colors z-10 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
          aria-label="Fechar Modal de Cadastro"
        >
          <X size={24} />
        </button>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Área do Logista
            </h2>
            <p className="text-md text-gray-600">
              Informe suas credencias para continuar.
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputGroup
              id="email"
              label="E-mail"
              icon={<Mail size={20} />}
              error={errors.email}
            >
              <input
                type="email"
                id="email"
                {...register("email")}
                className={inputStyle}
                placeholder="seuemail@empresa.com.br"
                disabled={isLoading}
              />
            </InputGroup>

            <InputGroup
              id="password"
              label="Senha"
              icon={<Lock size={20} />}
              error={errors.password}
            >
              <input
                type="password"
                id="password"
                {...register("password")}
                className={inputStyle}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </InputGroup>

            <button
              type="submit"
              disabled={isLoading || !isDirty || !isValid}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold text-lg 
                transition-all duration-300 ease-in-out shadow-lg shadow-blue-200/50 
                flex items-center justify-center gap-3 mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  const event = new CustomEvent("openForgotPasswordModal");
                  window.dispatchEvent(event);
                }, 100);
              }}
              disabled={isLoading}
              className="block text-sm cursor-pointer text-blue-700 hover:text-blue-800 hover:underline disabled:text-blue-500 text-center w-full"
            >
              Esqueceu sua senha?
            </button>
            <p className="text-sm text-gray-600">
              Não tem conta?{" "}
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const event = new CustomEvent("openRegisterModal");
                    window.dispatchEvent(event);
                  }, 100);
                }}
                disabled={isLoading}
                className="text-blue-700 hover:text-blue-800 hover:underline disabled:text-blue-500 font-medium cursor-pointer"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
