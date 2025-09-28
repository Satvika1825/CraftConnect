import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomerDashboard from './customer/CustomerDashboard';
import ProductCatalog from './customer/ProductCatalog';
import ShoppingCart from './customer/ShoppingCart';
import CustomerProfile from './customer/CustomerProfile';
import ArtisanDashboard from './artisan/ArtisanDashboard';
import MyProducts from './artisan/MyProducts';
import AddProduct from './artisan/AddProduct';
import OrderManagement from './artisan/OrderManagement';
import ArtisanProfile from './artisan/ArtisanProfile';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import ProductManagement from './admin/ProductManagement';
import AdminOrderManagement from './admin/AdminOrderManagement';
import AdminSettings from './admin/AdminSettings';

const RoleBasedApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>(() => {
    // Set initial view based on user role
    switch (user?.role) {
      case 'customer': return 'home';
      case 'artisan': return 'dashboard';
      case 'admin': return 'dashboard';
      default: return 'home';
    }
  });

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderMainContent = () => {
    if (!user) return null;

    // Customer Views
    if (user.role === 'customer') {
      switch (currentView) {
        case 'home':
          return <CustomerDashboard />;
        case 'products':
          return <ProductCatalog />;
        case 'cart':
          return <ShoppingCart />;
        case 'profile':
          return <CustomerProfile />;
        default:
          return <CustomerDashboard />;
      }
    }

    // Artisan Views
    if (user.role === 'artisan') {
      switch (currentView) {
        case 'dashboard':
          return <ArtisanDashboard onViewChange={handleViewChange} />;
        case 'my-products':
          return <MyProducts />;
        case 'add-product':
          return <AddProduct />;
        case 'orders':
          return <OrderManagement />;
        case 'profile':
          return <ArtisanProfile />;
        default:
          return <ArtisanDashboard onViewChange={handleViewChange} />;
      }
    }

    // Admin Views
    if (user.role === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard onViewChange={handleViewChange} />;
        case 'manage-users':
          return <UserManagement />;
        case 'manage-products':
          return <ProductManagement />;
        case 'manage-orders':
          return <AdminOrderManagement />;
        case 'settings':
          return <AdminSettings />;
        default:
          return <AdminDashboard onViewChange={handleViewChange} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-4 py-8">
        {renderMainContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default RoleBasedApp;