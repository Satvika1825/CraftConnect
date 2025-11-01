import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

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

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;

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
  }, [user, product._id]);

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

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
      
      if (!userResponse.data?._id) {
        toast.error('User not found');
        return;
      }

      const cartResponse = await axios.post('https://craftconnect-bbdp.onrender.com/cart-api/cart/add', {
        userId: userResponse.data._id,
        productId: product._id,
        quantity: 1
      });

      if (cartResponse.data) {
        toast.success('Added to cart!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  return (
    <Card className="group overflow-hidden border hover:border-primary transition-all duration-300 hover:shadow-lg relative">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-background/90 hover:bg-background backdrop-blur-sm border hover:border-primary transition-all duration-300 hover:scale-110"
          onClick={handleToggleLike}
        >
          <Heart className={`h-3.5 w-3.5 transition-all duration-300 ${isLiked ? 'fill-destructive text-destructive scale-125' : ''}`} />
        </Button>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-medium text-primary-foreground">{product.category}</span>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-bold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">₹{product.price}</span>
          <span className="text-xs text-muted-foreground">By {product.artisanName}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 gap-2 flex-col sm:flex-row">
        <Button 
          onClick={onViewDetails} 
          variant="outline" 
          size="sm" 
          className="w-full sm:flex-1 hover:border-primary transition-all duration-300"
        >
          View
        </Button>
        <Button 
          onClick={handleAddToCart} 
          size="sm" 
          className="w-full sm:flex-1 gap-1.5 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};
