"use client";

import { useState } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/src/application/services/auth/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup } from "../shared/InputGroups";
import { VerificationType } from "@/application/core/@types/verification.type";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const registerSchema = z
  .object({
    fullName: z.string().min(2, "O nome completo é obrigatório"),
    email: z.string().email("Formato de e-mail inválido"),
    phone: z
      .string()
      .regex(/^\d{10,15}$/, "Telefone inválido (apenas números)"),
    enterprise: z.string().min(2, "O nome da empresa é obrigatório"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [success, setSuccess] = useState("");
  const { signUp, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      enterprise: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSuccess("");

    const result = await signUp(data);

    if (result.success) {
      setSuccess("Conta criada com sucesso! Você será redirecionado.");

      setTimeout(() => {
        onClose();
        setSuccess("");
        reset();
        const event = new CustomEvent("openVerificationModal", {
          detail: {
            email: result.user.email,
            verification_type: VerificationType.CONFIRM_CODE,
          },
        });
        window.dispatchEvent(event);
      }, 3000);
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
              Cadastre sua Revenda
            </h2>
            <p className="text-md text-gray-600">
              Preencha os dados abaixo para se tornar um parceiro Grota.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3 text-red-800">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-800 font-medium text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputGroup
              id="fullName"
              label="Nome Completo (Responsável)"
              icon={<User size={20} />}
              error={errors.fullName}
            >
              <input
                type="text"
                id="fullName"
                {...register("fullName")}
                className={inputStyle}
                placeholder="Seu nome e sobrenome"
                disabled={isLoading}
              />
            </InputGroup>

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
                placeholder="exemplo@empresa.com.br"
                disabled={isLoading}
              />
            </InputGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                id="phone"
                label="Telefone (WhatsApp)"
                icon={<Phone size={20} />}
                error={errors.phone}
              >
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className={inputStyle}
                  placeholder="(99) 99999-9999"
                  disabled={isLoading}
                />
              </InputGroup>

              <InputGroup
                id="enterprise"
                label="Nome da Empresa (Loja)"
                icon={<Building size={20} />}
                error={errors.enterprise}
              >
                <input
                  type="text"
                  id="enterprise"
                  {...register("enterprise")}
                  className={inputStyle}
                  placeholder="Nome Fantasia"
                  disabled={isLoading}
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading}
                />
              </InputGroup>

              <InputGroup
                id="confirmPassword"
                label="Confirme a Senha"
                icon={<Lock size={20} />}
                error={errors.confirmPassword}
              >
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className={inputStyle}
                  placeholder="Repita sua senha"
                  disabled={isLoading}
                />
              </InputGroup>
            </div>

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
                  Criando conta...
                </>
              ) : (
                "Criar Conta de Parceiro"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Já possui sua conta?{" "}
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const event = new CustomEvent("openLoginModal");
                    window.dispatchEvent(event);
                  }, 100);
                }}
                disabled={isLoading}
                className="text-blue-700 hover:text-blue-800 hover:underline disabled:text-blue-500 font-medium cursor-pointer"
              >
                Voltar para login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
