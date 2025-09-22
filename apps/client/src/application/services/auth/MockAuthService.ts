export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  phone: string;
  company: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: any;
}

export class MockAuthService {
  async signIn({ email, password }: AuthCredentials): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Login realizado com sucesso!',
      user: { id: '1', email }
    };
  }

  async signUp({ email, password, name, phone, company }: RegisterData): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user: { id: '1', email, name, phone, company }
    };
  }

  async forgotPassword(email: string): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Instruções enviadas para seu email!'
    };
  }
}