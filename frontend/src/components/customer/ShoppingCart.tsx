import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import textileArt from '@/assets/textile-art.jpg';
import productsShowcase from '@/assets/products-showcase.jpg';

const ShoppingCart: React.FC = () => {
  const cartItems = [
    {
      id: 1,
      name: "Handwoven Silk Saree",
      artisan: "Priya Textile Arts",
      price: 4500,
      quantity: 1,
      image: textileArt
    },
    {
      id: 2,
      name: "Terracotta Pot Set",
      artisan: "Kumar Pottery", 
      price: 850,
      quantity: 2,
      image: productsShowcase
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          Your Shopping Cart
        </h1>
        <p className="text-muted-foreground">
          {cartItems.length} items ready for checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Cart Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-craft-deep-red">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.artisan}</p>
                      <p className="font-medium text-craft-terracotta">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        value={item.quantity} 
                        className="w-16 text-center h-8"
                        readOnly
                      />
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {index < cartItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-craft-terracotta">₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              <Button className="w-full" size="lg" variant="craft">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Enter promo code" />
              <Button variant="outline" className="w-full">
                Apply Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;