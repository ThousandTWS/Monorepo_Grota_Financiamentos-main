import { useState } from 'react';
import { MockAuthService, AuthCredentials, RegisterData, AuthResult } from '@/src/application/services/auth/MockAuthService';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authService = new MockAuthService();



  const signIn = async (credentials: AuthCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.signIn(credentials);
      if (!result.success) {
        setError(result.message);
      }
      return result;

    } catch (err) {
      const errorMessage = 'Erro de conexão. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  
  };

  const signUp = async (data: RegisterData): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.signUp(data);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMessage = 'Erro de conexão. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.forgotPassword(email);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMessage = 'Erro de conexão. Tente novamente.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    forgotPassword,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}