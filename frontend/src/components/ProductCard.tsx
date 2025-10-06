import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';

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
  const {user}=useUser();
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

const handleAddToCart = async () => {
  if (!user) {
    toast.error('Please login to add items to cart');
    return;
  }

  try {
    // Get user's MongoDB ID
    const userResponse = await axios.get(`http://localhost:3000/user-api/user/${user.id}`);
    console.log('User response:', userResponse.data); // Debug log

    if (!userResponse.data || !userResponse.data._id) {
      toast.error('User not found');
      return;
    }

    // Add item to cart
    const cartResponse = await axios.post('http://localhost:3000/cart-api/cart/add', {
      userId: userResponse.data._id,
      productId: product._id,
      quantity: 1
    });

    console.log('Cart response:', cartResponse.data); // Debug log

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
    <Card className="group overflow-hidden border-2 hover:border-primary transition-all duration-500 hover-lift relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta via-mustard to-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          className="absolute top-3 right-3 bg-background/90 hover:bg-background backdrop-blur-sm border-2 border-border hover:border-primary transition-all duration-300 hover:scale-110 shadow-lg"
          onClick={handleToggleLike}
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${isLiked ? 'fill-destructive text-destructive scale-125' : ''}`} />
        </Button>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full border border-primary-foreground/20">
          <span className="text-xs font-semibold text-primary-foreground">{product.category}</span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">₹{product.price}</span>
          <div className="flex items-center gap-1 text-mustard">
            <span className="text-sm">★★★★★</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 gap-3">
        <Button onClick={onViewDetails} variant="outline" className="flex-1 border-2 hover:border-primary transition-all duration-300">
          View Details
        </Button>
        <Button onClick={handleAddToCart} className="flex-1 gap-2 bg-primary hover:bg-primary/90 font-semibold transition-all duration-300 hover:scale-105 shadow-md">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
      
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full transform translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
    </Card>
  );
};
