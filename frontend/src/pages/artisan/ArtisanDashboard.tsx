import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useUser } from '@clerk/clerk-react';
import { Package, ShoppingBag, TrendingUp, Plus } from 'lucide-react';
import { useEffect,useState } from 'react';
import axios from 'axios';

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { products } = useStore();
  const [artisanId,setArtisanId]=useState('');
  const myProducts = products.filter((p) => p.artisanId === user?.id);
  const approvedProducts = myProducts.filter((p) => p.approved);
  const pendingProducts = myProducts.filter((p) => !p.approved);
 
  useEffect(() => {
  const fetchArtisanId = async () => {
    try {
      // Get user by clerkId
      const userResponse = await axios.get(`http://localhost:3000/user-api/user/${user.id}`);
      if (userResponse.data) {
        // Use the new endpoint to get artisan by userId
        const artisanResponse = await axios.get(`http://localhost:3000/artisan-api/artisans`, {
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

  // Modify the navigation to pass artisanId
  
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
            <p className="text-3xl font-bold">{myProducts.length}</p>
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
                  console.error('No artisan ID available');
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
          {myProducts.length === 0 ? (
            <p className="text-muted-foreground">You haven't added any products yet.</p>
          ) : (
            <div className="space-y-4">
              {myProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded">
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
