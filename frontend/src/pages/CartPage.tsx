import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Plus, Minus, Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Hand-painted Pottery Vase",
      artisan: "Meera Sharma",
      village: "Khurja, UP",
      price: 2500,
      quantity: 1,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Traditional Silk Saree",
      artisan: "Ravi Kumar", 
      village: "Banaras, UP",
      price: 8500,
      quantity: 1,
      image: "/placeholder.svg"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Shopping Cart</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
            <h1 className="heading-secondary">Your Cart ({cartItems.length} items)</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="craft-card">
                  <div className="flex gap-4 p-6">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="heading-tertiary mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        By {item.artisan} • {item.village}
                      </p>
                      <p className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 border rounded hover:bg-muted">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-1 border rounded hover:bg-muted text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="p-1 border rounded hover:bg-muted">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button className="p-1 border rounded hover:bg-muted">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="craft-card sticky top-24">
                <div className="p-6">
                  <h3 className="heading-tertiary mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button className="w-full craft-button-primary mb-4">
                    Proceed to Checkout
                  </button>
                  
                  <div className="text-center">
                    <Link to="/crafts" className="text-primary hover:text-primary-dark text-sm">
                      Continue Shopping →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;