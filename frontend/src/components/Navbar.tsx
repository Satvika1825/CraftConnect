import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  ShoppingBag, 
  User, 
  LogOut, 
  Package, 
  Plus, 
  ClipboardList,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import { UserRole } from '@/types/auth';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  const getNavigationItems = (role: UserRole) => {
    switch (role) {
      case 'customer':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'cart', label: 'Cart', icon: ShoppingBag },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'artisan':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'my-products', label: 'My Products', icon: Package },
          { id: 'add-product', label: 'Add Product', icon: Plus },
          { id: 'orders', label: 'Orders', icon: ClipboardList },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'manage-users', label: 'Manage Users', icon: Users },
          { id: 'manage-products', label: 'Manage Products', icon: Package },
          { id: 'manage-orders', label: 'Manage Orders', icon: ClipboardList },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navigationItems = user ? getNavigationItems(user.role) : [];

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-serif font-bold text-craft-terracotta">
              CraftConnect
            </div>
            {user && (
              <div className="hidden md:flex items-center space-x-1 ml-4 text-sm text-muted-foreground">
                <span>{user.avatar}</span>
                <span>{user.name}</span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          {user && (
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "craft" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;