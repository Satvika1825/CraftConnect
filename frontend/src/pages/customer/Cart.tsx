import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import * as icons from 'lucide-react'

interface CartItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
  };
  quantity: number;
}
export default function Cart() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      try {
        const userResponse = await axios.get(`http://localhost:3000/user-api/user/${user.id}`);
        if (!userResponse.data?._id) return;

        const cartResponse = await axios.get(`http://localhost:3000/cart-api/cart/${userResponse.data._id}`);
        setCartItems(cartResponse.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const total = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await axios.put(`http://localhost:3000/cart-api/cart/${itemId}`, {
        quantity: newQuantity
      });

      setCartItems(current =>
        current.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:3000/cart-api/cart/${itemId}`);
      setCartItems(current => current.filter(item => item._id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

const handleCheckout = async () => {
  if (!user) {
    toast.error('Please login to checkout');
    return;
  }

  try {
    // Get user's MongoDB ID
    const userResponse = await axios.get(`http://localhost:3000/user-api/user/${user.id}`);
    if (!userResponse.data?._id) {
      toast.error('User not found');
      return;
    }

    // Create order
    const orderResponse = await axios.post('http://localhost:3000/order-api/orders/create', {
      userId: userResponse.data._id,
      items: cartItems,
      total
    });

    if (orderResponse.data) {
      // Clear cart after successful order
      await Promise.all(cartItems.map(item => 
        axios.delete(`http://localhost:3000/cart-api/cart/${item._id}`)
      ));
      
      setCartItems([]);
      toast.success('Order placed successfully!');
      navigate('/customer/orders'); // Navigate to orders page
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    toast.error('Failed to process checkout');
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
        <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item._id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.productId.name}</h3>
                      <p className="text-muted-foreground text-sm">{item.productId.category}</p>
                      <p className="text-primary font-bold mt-2">₹{item.productId.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <icons.Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2 border rounded">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        >
                          <icons.Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          <icons.Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card className="p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
