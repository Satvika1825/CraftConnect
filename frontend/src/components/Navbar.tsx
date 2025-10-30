import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Home, Package, ShoppingBasket, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useEffect,useState } from 'react';
import axios from 'axios';

export const Navbar = () => {
  const { userRole, cart } = useStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const [artisanId,setArtisanId]=useState('');

    useEffect(() => {
  const fetchArtisanId = async () => {
    try {
      // Get user by clerkId
      const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
      if (userResponse.data) {
        // Use the new endpoint to get artisan by userId
        const artisanResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/artisan-api/artisans`, {
          params: { userId: userResponse.data._id }
        });
        if (artisanResponse.data) {
          setArtisanId(artisanResponse.data._id);
          console.log('Artisan ID set:', artisanResponse.data._id); // Debug log
        }
      }
    } catch (error) {
      console.error('Error fetching artisan ID:', error);
    }
  };

  if (user) {
    fetchArtisanId();
  }
}, [user]);
  const handleLogout = () => {
    useStore.getState().setUserRole(null);
    useStore.getState().clearCart();
    navigate('/');
  };

  const getNavLinks = () => {
    switch (userRole) {
      case 'customer':
        return (
          <>
            <Link to="/customer">
              <Button variant="ghost" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/customer/products">
              <Button variant="ghost" className="gap-2">
                <Package className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link to="/customer/liked">
              <Button variant="ghost" className="gap-2">
                <Heart className="h-4 w-4" />
                Liked
              </Button>
            </Link>
            <Link to="/customer/cart">
              <Button variant="ghost" className="gap-2 relative">
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/customer/orders">
              <Button variant="ghost" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </Button>
            </Link>
          </>
        );
      case 'artisan':
        return (
          <>
            <Link to="/artisan">
              <Button variant="ghost" className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/artisan/products">
              <Button variant="ghost" className="gap-2">
                <Package className="h-4 w-4" />
                My Products
              </Button>
            </Link>
            <Link 
              to="/artisan/add-product" 
              state={{ artisanId: artisanId }}
            >
              <Button variant="ghost">Add Product</Button>
            </Link>
            <Link to="/artisan/orders">
              <Button variant="ghost">Orders</Button>
            </Link>
            <Link to="/artisan/chat">
              <Button variant="ghost">Orders</Button>
            </Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="ghost">Users</Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="ghost">Orders</Button>
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-serif font-bold text-primary">CraftConnect</h1>
        </Link>

        <div className="flex items-center gap-4">
          {getNavLinks()}
          {user && (
            <div className="flex items-center gap-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
