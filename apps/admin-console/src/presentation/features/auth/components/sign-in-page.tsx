"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { SignInPageProps } from "@/application/core/@types/auth/Props/SignInPageProps"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAuth } from "@/application/services/auth/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().length(8, "A senha precisa ter 8 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#1B4B7C]/50 transition-colors focus-within:border-[#1B4B7C]/80">
    {children}
  </div>
)

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-[#1B4B7C] tracking-tighter text-4xl md:text-5xl">Bem-vindo</span>,
  description = "Acesse sua conta e continue sua jornada com a Grota Financiamentos",
  heroImageSrc,
}) => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginForm) => {
    clearError();

    if (!data.email || !data.password) {
      return;
    }

    try {
      const result = await signIn(data);

      if (result.success) {
        toast.success("Login realizado com sucesso!");
        router.push("/visao-geral");
      }
    } catch (error) {
      const errorMessage = "Erro de conexão. Tente novamente.";
      return { success: false, message: errorMessage };
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-sans w-[100dvw] bg-white">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 font-semibold leading-tight">{title}</h1>
            <p className="animate-element animate-delay-200 text-[#1B4B7C]/80">{description}</p>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="animate-element animate-delay-300">
                <label className="text-md font-medium text-[#1B4B7C]" htmlFor="email">E-mail</label>
                <GlassInputWrapper>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Digite seu e-mail"
                    className="w-full bg-white text-[#1B4B7C] placeholder:text-[#1B4B7C]/50 text-sm p-4 rounded-2xl focus:outline-none"
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
                
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-md font-medium text-[#1B4B7C]" htmlFor="password">Senha</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Digite sua senha"
                      className="w-full bg-white text-[#1B4B7C] placeholder:text-[#1B4B7C]/50 text-sm p-4 rounded-2xl focus:outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-[#1B4B7C] hover:text-[#0F2C55] transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#1B4B7C] hover:text-[#0F2C55] transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>

                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-end text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/esqueci-senha")
                  }}
                  className="hover:underline text-[#1B4B7C] transition-colors"
                >
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-[#1B4B7C] py-4 font-medium text-white hover:bg-[#0F2C55] transition-colors flex items-center justify-center gap-3"
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

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
            </form>

            <p className="animate-element animate-delay-900 text-center text-sm text-[#1B4B7C]/80">
              Novo por aqui?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/cadastro")
                }}
                className="text-[#1B4B7C] hover:underline transition-colors"
              >
                Criar Conta
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
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