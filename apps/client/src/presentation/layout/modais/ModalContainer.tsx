import { LoginModal } from "@/src/presentation/layout/modais/LoginModal"
import { RegisterModal } from "@/src/presentation/layout/modais/RegisterModal"
import { ForgotPasswordModal } from "@/src/presentation/layout/modais/ForgotPasswordModal"
import { ModalState, ModalActions } from "@/src/presentation/layout/navbar/hooks/useModalManager"

interface ModalContainerProps extends ModalState, ModalActions {}

export const ModalContainer = ({
  isLoginModalOpen,
  isRegisterModalOpen,
  isForgotPasswordModalOpen,
  closeLoginModal,
  closeRegisterModal,
  closeForgotPasswordModal
}: ModalContainerProps) => {
  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={closeForgotPasswordModal} />
    </>
  )
}