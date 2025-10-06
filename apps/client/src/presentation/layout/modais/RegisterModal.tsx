"use client";

import { useState } from "react";
import { X, User, Lock, Mail, Phone, Building, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/src/application/services/auth/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nome é obrigatório"),
    email: z.string(),
    phone: z.string(),
    enterprise: z.string(),
    password: 
      z.string()
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .max(8, 'Senha deve ter no máximo 50 caracteres'),
    confirmPassword: z.string() 
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});


export type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [success, setSuccess] = useState("");
  const { signUp, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
    fullName: "",
    email: "",
    phone: "",
    enterprise: "",
    password: "",
    confirmPassword: ""
    }
  });

  const onSubmit = async (data:RegisterFormData) => {
   
    console.log(data);

    const result = await signUp(data);

    if(result.success){
      console.log(result.message)
      //Aqui você pode:
      //Mostrar toast
      //Fechar modal
      //Redirecionar usuário
    } else {
      console.log(result.message)
    }
  }

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro de Lojista</h2>
            <p className="text-gray-600">Crie sua conta para começar</p>
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
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  {...register("fullName")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Seu nome completo"
                  required
                  disabled={isLoading}
                />
                {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="+5511999999999"
                  required
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  {...register("enterprise")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Nome da empresa"
                  required
                  disabled={isLoading}
                />
                {errors.enterprise && <p className="text-sm text-red-600 mt-1">{errors.enterprise.message}</p>}
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
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}