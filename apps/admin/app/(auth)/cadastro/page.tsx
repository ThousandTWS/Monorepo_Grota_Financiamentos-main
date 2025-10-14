"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { SignUpPage } from "@/presentation/features/auth/components/sign-up-page"

export default function SignUp() {
  const router = useRouter()

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Cadastro enviado:", data)
    alert("Cadastro enviado! Verifique o console do navegador para os dados do formulário.")
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  return (
    <SignUpPage
      heroImageSrc="https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg"
      
      onSignUp={handleSignUp}
      onSignIn={handleSignIn}
    />
  )
}
