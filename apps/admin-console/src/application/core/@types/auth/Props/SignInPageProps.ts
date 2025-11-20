export interface SignInPageProps {
  title?: React.ReactNode
  description?: React.ReactNode
  heroImageSrc?: string
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void
}