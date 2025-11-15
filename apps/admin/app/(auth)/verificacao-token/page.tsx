import { VerifyTokenPage } from "@/presentation/features/auth/components/verify-token-page"

interface VerificationTokenProps {
  searchParams: {
    tipo: "verificacao" | "redefinicao-senha";
    email: string;
  }
}

export default function VerificationToken({ searchParams }: VerificationTokenProps) {
  return (
    <VerifyTokenPage
      heroImageSrc="https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg"
      tokenType={searchParams.tipo}
      email={searchParams.email}
    />
  )
}
