"use client";

import { useState } from "react";
import { X, User, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/src/application/services/auth/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
});

type LoginForm = z.infer<typeof loginSchema>

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, isLoading, error, clearError} = useAuth();
  const [success, setSuccess] = useState("");


  const{
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

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
        //window.location.href = "/dashboard";
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Área do Lojista</h2>
            <p className="text-gray-600">Acesse sua conta para continuar</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  {...register("password")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
                  const event = new CustomEvent('openForgotPasswordModal');
                  window.dispatchEvent(event);
                }, 100);
              }}
              disabled={isLoading}
              className="block text-sm cursor-pointer text-orange-500 hover:text-orange-600 disabled:text-orange-300 text-center w-full"
            >
              Esqueceu sua senha?
            </button>
            <p className="text-sm text-gray-600">
              Não tem conta?{" "}
              <button 
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const event = new CustomEvent('openRegisterModal');
                    window.dispatchEvent(event);
                  }, 100);
                }}
                disabled={isLoading}
                className="text-orange-500 hover:text-orange-600 disabled:text-orange-300 font-medium cursor-pointer"
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