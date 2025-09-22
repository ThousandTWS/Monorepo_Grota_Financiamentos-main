import { useState, useEffect } from 'react'

export interface ModalState {
  isLoginModalOpen: boolean
  isRegisterModalOpen: boolean
  isForgotPasswordModalOpen: boolean
}

export interface ModalActions {
  openLoginModal: () => void
  closeLoginModal: () => void
  openRegisterModal: () => void
  closeRegisterModal: () => void
  openForgotPasswordModal: () => void
  closeForgotPasswordModal: () => void
}

export const useModalManager = (): ModalState & ModalActions => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)

  useEffect(() => {
    const handleOpenRegisterModal = () => setIsRegisterModalOpen(true)
    const handleOpenForgotPasswordModal = () => setIsForgotPasswordModalOpen(true)
    const handleOpenLoginModal = () => setIsLoginModalOpen(true)
    
    window.addEventListener('openRegisterModal', handleOpenRegisterModal)
    window.addEventListener('openForgotPasswordModal', handleOpenForgotPasswordModal)
    window.addEventListener('openLoginModal', handleOpenLoginModal)
    
    return () => {
      window.removeEventListener('openRegisterModal', handleOpenRegisterModal)
      window.removeEventListener('openForgotPasswordModal', handleOpenForgotPasswordModal)
      window.removeEventListener('openLoginModal', handleOpenLoginModal)
    }
  }, [])

  return {
    isLoginModalOpen,
    isRegisterModalOpen,
    isForgotPasswordModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false),
    openRegisterModal: () => setIsRegisterModalOpen(true),
    closeRegisterModal: () => setIsRegisterModalOpen(false),
    openForgotPasswordModal: () => setIsForgotPasswordModalOpen(true),
    closeForgotPasswordModal: () => setIsForgotPasswordModalOpen(false)
  }
}