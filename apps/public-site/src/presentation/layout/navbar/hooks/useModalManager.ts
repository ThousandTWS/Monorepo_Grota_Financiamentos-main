import { VerificationType } from "@/application/core/@types/verification.type";
import { useState, useEffect } from "react";

export interface ModalState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  isVerificationModalOpen: boolean;
  verificationEmail: string | null;
  verificationType: VerificationType | null;
  isForgotPasswordModalOpen: boolean;
}

export interface ModalActions {
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  openVerificationModal: () => void;
  closeVerificationModal: () => void;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
}

export const useModalManager = (): ModalState & ModalActions => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null
  );
  const [verificationType, setVerificationType] =
    useState<VerificationType | null>(null);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  useEffect(() => {
    const handleOpenRegisterModal = () => setIsRegisterModalOpen(true);
    const handleOpenVerificationModal = (event: Event) => {
      const customEvent = event as CustomEvent<{
        email: string;
        verification_type: VerificationType;
      }>;
      setVerificationEmail(customEvent.detail.email);
      setVerificationType(customEvent.detail.verification_type);
      setIsVerificationModalOpen(true);
    };
    const handleOpenForgotPasswordModal = () =>
      setIsForgotPasswordModalOpen(true);
    const handleOpenLoginModal = () => setIsLoginModalOpen(true);

    window.addEventListener("openRegisterModal", handleOpenRegisterModal);
    window.addEventListener(
      "openForgotPasswordModal",
      handleOpenForgotPasswordModal
    );
    window.addEventListener("openLoginModal", handleOpenLoginModal);
    window.addEventListener(
      "openVerificationModal",
      handleOpenVerificationModal
    );

    return () => {
      window.removeEventListener("openRegisterModal", handleOpenRegisterModal);
      window.removeEventListener(
        "openForgotPasswordModal",
        handleOpenForgotPasswordModal
      );
      window.removeEventListener("openLoginModal", handleOpenLoginModal);
      window.removeEventListener(
        "openVerificationModal",
        handleOpenVerificationModal
      );
    };
  }, []);

  return {
    isLoginModalOpen,
    isRegisterModalOpen,
    isForgotPasswordModalOpen,
    isVerificationModalOpen,
    verificationEmail,
    verificationType,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false),
    openRegisterModal: () => setIsRegisterModalOpen(true),
    closeRegisterModal: () => setIsRegisterModalOpen(false),
    openVerificationModal: () => setIsVerificationModalOpen(true),
    closeVerificationModal: () => setIsVerificationModalOpen(false),
    openForgotPasswordModal: () => setIsForgotPasswordModalOpen(true),
    closeForgotPasswordModal: () => setIsForgotPasswordModalOpen(false),
  };
};
