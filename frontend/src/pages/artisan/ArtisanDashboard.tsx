import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Package, ShoppingBag, TrendingUp, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artisanId: string;
  approved: boolean;
}

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [artisanId, setArtisanId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get user by clerkId
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
        if (userResponse.data) {
          // Get artisan profile
          const artisanResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/artisan-api/artisans`, {
            params: { userId: userResponse.data._id }
          });
          
          if (artisanResponse.data) {
            const artisanId = artisanResponse.data._id;
            setArtisanId(artisanId);

            // Fetch products for this artisan
            const productsResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/product-api/products`, {
              params: { artisanId }
            });
            setProducts(productsResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const approvedProducts = products.filter((p) => p.approved);
  const pendingProducts = products.filter((p) => !p.approved);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Artisan Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user?.firstName || 'Artisan'}!</p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
              <Package className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
              <ShoppingBag className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{approvedProducts.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending Approval</h3>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold">{pendingProducts.length}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => {
                if (artisanId) {
                  console.log('Navigating with artisanId:', artisanId);
                  navigate('/artisan/add-product', { 
                    state: { artisanId } 
                  });
                } else {
                  toast.error('Unable to add product. Please try again later.');
                }
              }} 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
            <Button variant="outline" onClick={() => navigate('/artisan/products')}>
              Manage Products
            </Button>
            <Button variant="outline" onClick={() => navigate('/artisan/orders')}>
              View Orders
            </Button>
          </div>
        </Card>

        {/* Recent Products */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground">You haven't added any products yet.</p>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-4 border rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{product.price}</p>
                    <p className={`text-sm ${product.approved ? 'text-accent' : 'text-secondary'}`}>
                      {product.approved ? 'Approved' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
