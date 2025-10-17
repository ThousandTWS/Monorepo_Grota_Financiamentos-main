"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { ResetPasswordPage } from "@/presentation/features/auth/components/reset-password-page"

export default function EsqueciSenha() {
  const router = useRouter()

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Reset password submitted:", data)
    alert("Reset password submitted! Check the browser console for form data.")
  }

  const handleBackToSignIn = () => {
    router.push("/login")
  }

  return (
    <ResetPasswordPage
      heroImageSrc="https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg"
      onResetPassword={handleResetPassword}
      onBackToSignIn={handleBackToSignIn}
    />
  )
}
