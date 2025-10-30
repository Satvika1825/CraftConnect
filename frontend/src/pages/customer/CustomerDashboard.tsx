import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';
import pottery from '@/assets/pottery.jpg';
import weaving from '@/assets/weaving.jpg';
import embroidery from '@/assets/embroidery.jpg';
import woodwork from '@/assets/woodwork.jpg';
import jewelry from '@/assets/jewelry.jpg';
import painting from '@/assets/painting.jpg';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MessageCircle, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import AIChatMentor from '@/components/ui/AIChatMentor';

const crafts = [
  { name: 'Pottery', image: pottery, category: 'Pottery' },
  { name: 'Weaving', image: weaving, category: 'Weaving' },
  { name: 'Embroidery', image: embroidery, category: 'Embroidery' },
  { name: 'Woodwork', image: woodwork, category: 'Woodwork' },
  { name: 'Jewelry', image: jewelry, category: 'Jewelry' },
  { name: 'Painting', image: painting, category: 'Painting' },
];

interface Product {
  _id: string;
  id: string;
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

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://craftconnect-bbdp.onrender.com/product-api/products', {
          params: { approved: true }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 6);

  const handleCraftClick = (category: string) => {
    navigate(`/customer/products?category=${category}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-destructive/70 to-accent/75" />
        </div>
        
        {/* Decorative patterns */}
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-mustard/20 rounded-full animate-float" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border-4 border-teal/20 rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-4 animate-bounce-subtle">
            <span className="text-6xl">🎨</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-warm-beige drop-shadow-xl animate-fade-in">
            Welcome to <span className="text-mustard">CraftConnect</span>
          </h1>
          <p className="text-xl md:text-2xl text-warm-beige/95 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore authentic Indian handicrafts made by skilled artisans
          </p>
          <Button 
            size="lg" 
            className="bg-mustard hover:bg-mustard/90 text-foreground font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            onClick={() => navigate('/customer/products')}
          >
            Browse All Products
          </Button>
        </div>
      </section>

      {/* Shop by Craft */}
      <section className="py-20 bg-gradient-to-b from-card to-background pattern-grid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-primary rounded" />
                <span className="text-sm font-semibold tracking-widest uppercase">Crafts</span>
                <div className="w-12 h-1 bg-gradient-to-l from-transparent via-primary to-primary rounded" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Shop by Craft</h2>
            <p className="text-muted-foreground text-lg">Explore traditional Indian handicrafts</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {crafts.map((craft, index) => (
              <div
                key={craft.name}
                onClick={() => handleCraftClick(craft.category)}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square relative overflow-hidden rounded-2xl border-2 border-border hover:border-primary transition-all duration-500 hover-lift">
                  <img
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform group-hover:translate-y-0 transition-transform">
                      <h3 className="text-lg font-bold text-warm-beige drop-shadow-lg">{craft.name}</h3>
                      <div className="w-12 h-1 bg-mustard mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <div className="inline-block mb-2">
                  <div className="flex items-center gap-2 text-accent">
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent via-accent to-accent rounded" />
                    <span className="text-sm font-semibold tracking-widest uppercase">Featured</span>
                    <div className="w-8 h-1 bg-gradient-to-l from-transparent via-accent to-accent rounded" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-accent via-teal to-primary bg-clip-text text-transparent">Featured Products</h2>
              </div>
              <Button 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-6 py-5 rounded-full transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/customer/products')}
              >
                View All →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={() => navigate(`/customer/products/${product._id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {loading && (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )}
      
      <Footer />

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-accent text-accent-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 animate-bounce-subtle"
        aria-label="Open AI Shopping Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsChatOpen(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background border-l shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">AI Shopping Assistant</h2>
                  <p className="text-xs text-muted-foreground">Ask me about products, gifts & more!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <AIChatMentor 
                userType="customer" 
                userId={user?.id}
                isEmbedded={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}