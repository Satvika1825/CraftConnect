import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import RoleBasedApp from '@/components/RoleBasedApp';

const Index = () => {
  const { user } = useAuth();

  return user ? <RoleBasedApp /> : <Login />;
};

export default Index;
