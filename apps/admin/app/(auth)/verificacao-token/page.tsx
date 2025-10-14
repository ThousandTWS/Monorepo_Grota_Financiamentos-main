"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { VerifyTokenPage } from "@/presentation/features/auth/components/verify-token-page"

export default function VerificationToken() {
  const router = useRouter()

  const handleVerifyToken = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Token submitted:", data)
    alert("Token submitted! Check the browser console for form data.")
  }

  const handleBackToSignIn = () => {
    router.push("/")
  }

  return (
    <VerifyTokenPage
      heroImageSrc="https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg"
      onVerifyToken={handleVerifyToken}
      onBackToSignIn={handleBackToSignIn}
    />
  )
}
