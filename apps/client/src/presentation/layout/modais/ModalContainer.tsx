import { LoginModal } from "@/src/presentation/layout/modais/LoginModal";
import { RegisterModal } from "@/src/presentation/layout/modais/RegisterModal";
import { ForgotPasswordModal } from "@/src/presentation/layout/modais/ForgotPasswordModal";
import {
  ModalState,
  ModalActions,
} from "@/src/presentation/layout/navbar/hooks/useModalManager";
import { VerificationModal } from "./VerificationModal";

interface ModalContainerProps extends ModalState, ModalActions {}

export const ModalContainer = ({
  isLoginModalOpen,
  isRegisterModalOpen,
  isVerificationModalOpen,
  isForgotPasswordModalOpen,
  verificationEmail,
  verificationType,
  closeLoginModal,
  closeRegisterModal,
  closeVerificationModal,
  closeForgotPasswordModal,
}: ModalContainerProps) => {
  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
      />
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={closeVerificationModal}
        email={verificationEmail}
        type={verificationType}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
      />
    </>
  );
};
