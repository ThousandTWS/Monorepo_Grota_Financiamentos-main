"use client";

import { useState } from "react";
import { X, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  email: string; 
}

export function VerificationModal({ isOpen, onClose, onSuccess, email }: VerificationModalProps) {
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length !== 6) { 
      setError("O código deve ter 6 dígitos.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // --- LÓGICA REAL DE BACKEND AQUI ---
    try {
      
      // const response = await api.post('/auth/verify-token', { email, token });
      
      // Simulação de sucesso após 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      // if (response.data.success) {
      if (token === "123456") { 
        onSuccess(); 
      } else {
        setError("Código inválido. Por favor, verifique sua caixa de entrada.");
      }
    } catch (apiError: any) {
      setError(apiError.response?.data?.message || "Erro ao verificar o código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative p-8 sm:p-10">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-blue-700 transition-colors z-10 p-2 rounded-full hover:bg-gray-100"
          aria-label="Fechar Modal de Verificação"
          disabled={isLoading}
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <Mail size={40} className="mx-auto text-blue-700 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação por E-mail</h2>
          <p className="text-gray-600 text-sm">
            Enviamos um código de 6 dígitos para <span className="font-semibold text-gray-800">{email}</span>.
            Insira-o abaixo para ativar sua conta.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3 text-red-800">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifyToken} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              maxLength={6}
              value={token}
              onChange={(e) => {
                setToken(e.target.value.replace(/\D/g, '')); // Aceita apenas números
                setError(null);
              }}
              className="w-full text-center text-xl font-mono tracking-widest p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50"
              placeholder="CÓDIGO (6 dígitos)"
              disabled={isLoading}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || token.length !== 6}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirmar Código
              </>
            )}
          </button>
          
          {/* Opcional: Link para reenviar o código */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Não recebeu o código? 
            <button type="button" className="text-blue-700 hover:text-blue-800 font-medium ml-1 disabled:opacity-50" disabled={isLoading}>
              Reenviar
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}