export interface ResetPasswordPageProps {
  title?: React.ReactNode
  description?: React.ReactNode
  heroImageSrc?: string
  onResetPassword?: (event: React.FormEvent<HTMLFormElement>) => void
  onBackToSignIn?: () => void
}