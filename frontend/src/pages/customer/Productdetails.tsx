import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, ArrowLeft, Package, User } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUser } from '@clerk/clerk-react';
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
  stock: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`https://craftconnect-bbdp.onrender.com/product-api/products/${id}`);
        setProduct(response.data);
        
        // Fetch similar products
        if (response.data.category) {
          const similarResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/product-api/products?category=${response.data.category}`);
          const filtered = similarResponse.data.filter((p: Product) => p._id !== id).slice(0, 6);
          setSimilarProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Check like status
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user || !product) return;

      try {
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
        const likesResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/like-api/likes/${userResponse.data._id}`);
        const liked = likesResponse.data.some((like: any) => like.productId._id === product._id);
        setIsLiked(liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [user, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/customer/products')}>
            Back to Products
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    try {
      const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
      
      if (!userResponse.data || !userResponse.data._id) {
        toast.error('User not found');
        return;
      }

      await axios.post('https://craftconnect-bbdp.onrender.com/cart-api/cart/add', {
        userId: userResponse.data._id,
        productId: product._id,
        quantity: 1
      });

      toast.success('Added to cart!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      toast.error('Please login to like products');
      return;
    }

    try {
      const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
      const response = await axios.post('https://craftconnect-bbdp.onrender.com/like-api/likes/toggle', {
        userId: userResponse.data._id,
        productId: product._id
      });

      setIsLiked(response.data.liked);
      toast.success(response.data.liked ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const handleSimilarProductClick = (productId: string) => {
    navigate(`/customer/products/${productId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/customer/products')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border bg-card shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-serif font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary mb-6">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock & Artisan Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-sm text-muted-foreground">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Artisan</p>
                  <p className="text-sm text-muted-foreground">
                    {product.artisanName}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <Button
                onClick={handleToggleLike}
                variant="outline"
                className="w-full h-12 text-lg"
                size="lg"
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${
                    isLiked ? 'fill-current text-red-500' : ''
                  }`}
                />
                {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="mt-20 border-t pt-12">
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold mb-2">
                Similar Products
              </h2>
              <p className="text-muted-foreground">
                You might also like these handcrafted items
              </p>
            </div>

            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {similarProducts.map((similarProduct) => (
                  <CarouselItem
                    key={similarProduct._id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <ProductCard
                      product={similarProduct}
                      onViewDetails={() =>
                        handleSimilarProductClick(similarProduct._id)
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}