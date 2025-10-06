import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@clerk/clerk-react';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artisanId: string;
  stock: number;
  approved: boolean;
}

export default function MyProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      try {
        // First get the artisan ID using the user's Clerk ID
        const userResponse = await axios.get(`http://localhost:3000/user-api/user/${user.id}`);
        if (userResponse.data) {
          const artisanResponse = await axios.get(`http://localhost:3000/artisan-api/artisans`, {
            params: { userId: userResponse.data._id }
          });
          
          if (artisanResponse.data) {
            // Get products for this artisan
            const productsResponse = await axios.get(`http://localhost:3000/product-api/products`, {
              params: { artisanId: artisanResponse.data._id }
            });
            setProducts(productsResponse.data);
          }
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:3000/product-api/products/${productId}`);
      setProducts(current => current.filter(p => p._id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

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
        <h1 className="text-4xl font-serif font-bold mb-8">My Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">You haven't added any products yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.approved ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'
                    }`}>
                      {product.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-bold">₹{product.price}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
