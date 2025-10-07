import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CLERK_PUBLISHABLE_KEY } from '@/lib/clerk';
import Landing from './pages/Landing';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Products from './pages/customer/Products';
import LikedProducts from './pages/customer/LikedProducts';
import Cart from './pages/customer/Cart';
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import MyProducts from './pages/artisan/MyProducts';
import AddProduct from './pages/artisan/AddProduct';
import ArtisanOrders from './pages/artisan/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import NotFound from './pages/NotFound';
import OrdersCustomer from './pages/customer/OrdersCustomer';

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/products" element={<Products />} />
            <Route path="/customer/liked" element={<LikedProducts />} />
            <Route path="/customer/cart" element={<Cart />} />
            <Route path="/customer/orders" element={<OrdersCustomer />} />
            
            {/* Artisan Routes */}
            <Route path="/artisan" element={<ArtisanDashboard />} />
            <Route path="/artisan/products" element={<MyProducts />} />
            <Route path="/artisan/add-product" element={<AddProduct />} />
            <Route path="/artisan/orders" element={<ArtisanOrders />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </BrowserRouter>
);

export default App;
