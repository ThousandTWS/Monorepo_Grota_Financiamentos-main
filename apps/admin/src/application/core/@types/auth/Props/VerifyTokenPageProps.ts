
export interface VerifyTokenPageProps {
  title?: React.ReactNode
  description?: React.ReactNode
  heroImageSrc?: string
  onVerifyToken?: (event: React.FormEvent<HTMLFormElement>) => void
  onBackToSignIn?: () => void
}
