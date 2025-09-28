import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, LoginForm, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginForm) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user creation based on role
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: getRoleDisplayName(credentials.role),
      role: credentials.role,
      avatar: getAvatarByRole(credentials.role),
      createdAt: new Date(),
    };
    
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'customer': return 'Craft Enthusiast';
      case 'artisan': return 'Master Artisan';
      case 'admin': return 'Platform Admin';
      default: return 'User';
    }
  };

  const getAvatarByRole = (role: UserRole): string => {
    switch (role) {
      case 'customer': return '🛍️';
      case 'artisan': return '🏺';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};