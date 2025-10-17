export interface SignUpPageProps {
  heroImageSrc?: string
  onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void
  onSignIn?: () => void
}