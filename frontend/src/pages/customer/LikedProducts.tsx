import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/lib/store';

export default function LikedProducts() {
  const navigate = useNavigate();
  const { products, likedProducts } = useStore();
  
  const likedProductsList = products.filter((p) => likedProducts.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Liked Products</h1>

        {likedProductsList.length === 0 ? (
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
            {likedProductsList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => navigate(`/customer/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
