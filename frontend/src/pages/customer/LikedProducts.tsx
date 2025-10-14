import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  artisanName: string;
}

export default function LikedProducts() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (!user) return;

      try {
        // Get user's MongoDB ID
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com-api/user-api/user/${user.id}`);
        if (!userResponse.data?._id) return;

        // Get liked products
        const likesResponse = await axios.get(`https://craftconnect-bbdp.onrender.com-api/like-api/likes/${userResponse.data._id}`);
        // Extract products from likes data
        const products = likesResponse.data.map((like: any) => like.productId);
        setLikedProducts(products);
      } catch (error) {
        console.error('Error fetching liked products:', error);
        toast.error('Failed to load liked products');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [user]);

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
        <h1 className="text-4xl font-serif font-bold mb-8">Liked Products</h1>

        {likedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">You haven't liked any products yet</p>
            <button
              onClick={() => navigate('/customer/products')}
              className="text-primary hover:underline"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={() => navigate(`/customer/products/${product._id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
