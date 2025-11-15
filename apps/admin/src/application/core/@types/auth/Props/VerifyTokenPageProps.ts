
export interface VerifyTokenPageProps {
  title?: React.ReactNode
  description?: React.ReactNode
  heroImageSrc?: string
  tokenType: "verificacao" | "redefinicao-senha"
  email: string
}
