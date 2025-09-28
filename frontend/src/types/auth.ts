export type UserRole = 'customer' | 'artisan' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface LoginForm {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}