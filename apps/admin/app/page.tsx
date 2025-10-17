"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { SignInPage } from "@/presentation/features/auth/components/sign-in-page"

export default function Login() {
  const router = useRouter()

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Login enviado:", data)
    alert("Login enviado! Verifique o console do navegador para ver os dados do formulário.")
  }

  const handleResetPassword = () => {
    router.push("/esqueci-senha")
  }

  const handleCreateAccount = () => {
    router.push("/cadastro")
  }

  return (
    <SignInPage
      heroImageSrc="https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg"
      onSignIn={handleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  )
}
