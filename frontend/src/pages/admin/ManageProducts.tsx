import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
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
  artisanName: string;
  approved: boolean;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('http://localhost:3000/product-api/products');
      setProducts(response.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (productId: string) => {
    try {
      await axios.patch(`http://localhost:3000/product-api/products/${productId}`, {
        approved: true
      });
      
      // Update local state
      setProducts(currentProducts => 
        currentProducts.map(product => 
          product._id === productId ? { ...product, approved: true } : product
        )
      );
      
      toast.success('Product approved successfully!');
    } catch (error: any) {
      console.error('Error approving product:', error);
      toast.error(error.response?.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:3000/product-api/products/${productId}`);
      
      // Update local state
      setProducts(currentProducts => 
        currentProducts.filter(product => product._id !== productId)
      );
      
      toast.success('Product rejected and removed');
    } catch (error: any) {
      console.error('Error rejecting product:', error);
      toast.error(error.response?.data?.message || 'Failed to reject product');
    }
  };

  const pendingProducts = products.filter(p => !p.approved);
  const approvedProducts = products.filter(p => p.approved);

   if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
   );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Manage Products</h1>

        {/* Pending Approval */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Pending Approval ({pendingProducts.length})</h2>
          {pendingProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No products pending approval</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProducts.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {product.artisanName}</p>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary font-bold">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(product._id)}
                        className="flex-1 gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(product._id)}
                        variant="destructive"
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Approved Products */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Approved Products ({approvedProducts.length})
          </h2>
          {approvedProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No approved products yet</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {approvedProducts.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-primary font-bold mt-1">₹{product.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
