import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, ArrowLeft, Package, User, Share2, Star } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    clerkId: string;
  };
  productId: string;
  rating: number;
  review: string;
  images?: string[];
  createdAt: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

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

        // Fetch reviews
        await fetchReviews();
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

  // Fetch reviews
  const fetchReviews = async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`https://craftconnect-bbdp.onrender.com/review-api/reviews/product/${id}`);
      setReviews(response.data);
      
      // Calculate average rating
      if (response.data.length > 0) {
        const avg = response.data.reduce((sum: number, review: Review) => sum + review.rating, 0) / response.data.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

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

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - a handcrafted product by ${product.artisanName}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleViewArtisan = () => {
    navigate(`/customer/artisan/${product.artisanId}`);
  };

  const handleSimilarProductClick = (productId: string) => {
    navigate(`/customer/products/${productId}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
              
              {/* Rating Display */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

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

              <div className="flex items-center gap-3 cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors" onClick={handleViewArtisan}>
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Artisan</p>
                  <p className="text-sm text-primary hover:underline">
                    {product.artisanName}
                  </p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
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

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleToggleLike}
                  variant="outline"
                  className="h-12"
                  size="lg"
                >
                  <Heart
                    className={`mr-2 h-5 w-5 ${
                      isLiked ? 'fill-current text-red-500' : ''
                    }`}
                  />
                  {isLiked ? 'Favorited' : 'Favorite'}
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="h-12"
                  size="lg"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-20 border-t pt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-2">
              Customer Reviews
            </h2>
            <p className="text-muted-foreground">
              See what others are saying about this product
            </p>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg mb-2">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to review this product! Purchase and share your experience.
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.userId.name}`} />
                        <AvatarFallback>{review.userId.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.userId.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          {review.review}
                        </p>
                        
                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => window.open(image, '_blank')}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

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