import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import heroBanner from '@/assets/hero-banner.jpg';
import pottery from '@/assets/pottery.jpg';
import weaving from '@/assets/weaving.jpg';
import embroidery from '@/assets/embroidery.jpg';
import woodwork from '@/assets/woodwork.jpg';
import jewelry from '@/assets/jewelry.jpg';
import painting from '@/assets/painting.jpg';

const crafts = [
  { name: 'Pottery', image: pottery },
  { name: 'Weaving', image: weaving },
  { name: 'Embroidery', image: embroidery },
  { name: 'Woodwork', image: woodwork },
  { name: 'Jewelry', image: jewelry },
  { name: 'Painting', image: painting },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { userRole, setUserRole } = useStore();

  useEffect(() => {
    if (isSignedIn && userRole) {
      navigate(`/${userRole}`);
    }
  }, [isSignedIn, userRole, navigate]);

  const handleRoleSelection = (role: 'customer' | 'artisan' | 'admin') => {
    setUserRole(role);
    navigate(`/${role}`);
  };

  if (isSignedIn && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background pattern-grid p-4">
        <Card className="p-10 max-w-2xl w-full border-2 hover:border-primary transition-all duration-500 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-terracotta via-mustard to-teal" />
          <div className="text-center mb-10">
            <div className="inline-block mb-4 animate-bounce-subtle">
              <span className="text-6xl">🎨</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              How would you like to use CraftConnect?
            </p>
          </div>
          <div className="space-y-5">
            <Button
              onClick={() => handleRoleSelection('customer')}
              variant="outline"
              className="w-full h-20 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 group"
            >
              <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">🛍️</span>
              <span className="font-semibold">Customer - Shop Handicrafts</span>
            </Button>
            <Button
              onClick={() => handleRoleSelection('artisan')}
              variant="outline"
              className="w-full h-20 text-lg border-2 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 hover:scale-105 group"
            >
              <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">🎨</span>
              <span className="font-semibold">Artisan - Sell Your Crafts</span>
            </Button>
            <Button
              onClick={() => handleRoleSelection('admin')}
              variant="outline"
              className="w-full h-20 text-lg border-2 hover:border-accent hover:bg-accent/5 transition-all duration-300 hover:scale-105 group"
            >
              <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">⚙️</span>
              <span className="font-semibold">Admin - Manage Platform</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pattern-dots">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-destructive/90 to-accent/85" />
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border-4 border-mustard/30 rounded-full animate-float" />
        <div className="absolute bottom-32 right-16 w-16 h-16 border-4 border-teal/30 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/4 w-12 h-12 border-4 border-warm-beige/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-mustard/20 backdrop-blur-sm rounded-full border-2 border-mustard/40 animate-pulse-glow">
            <span className="text-warm-beige font-semibold">🪔 Authentic Indian Craftsmanship 🪔</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 text-warm-beige animate-fade-in drop-shadow-2xl">
            Discover Authentic
            <br />
            <span className="text-mustard animate-shimmer bg-gradient-to-r from-mustard via-warm-beige to-mustard bg-clip-text text-transparent bg-[length:200%_auto]">Indian Handicrafts</span>
          </h1>
          <p className="text-xl md:text-2xl text-warm-beige/95 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect directly with skilled artisans and bring home the beauty of traditional craftsmanship
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-10 py-7 bg-mustard hover:bg-mustard/90 text-foreground font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce-subtle">
                Get Started →
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-warm-beige/10 border-2 border-warm-beige/30 text-warm-beige hover:bg-warm-beige/20 backdrop-blur-sm font-semibold rounded-full transition-all duration-300 hover:scale-105">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Shop by Craft Section */}
      <section className="py-20 bg-gradient-to-b from-card to-background pattern-grid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-primary rounded" />
                <span className="text-sm font-semibold tracking-widest uppercase">Explore</span>
                <div className="w-12 h-1 bg-gradient-to-l from-transparent via-primary to-primary rounded" />
              </div>
            </div>
            <h2 className="text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Shop by Craft
            </h2>
            <p className="text-muted-foreground text-lg">Traditional Indian handicrafts from master artisans</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {crafts.map((craft, index) => (
              <Card
                key={craft.name}
                className="group cursor-pointer overflow-hidden border-2 hover:border-primary transition-all duration-500 hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-warm-beige drop-shadow-lg">{craft.name}</h3>
                      <div className="w-12 h-1 bg-mustard mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 text-accent">
                <div className="w-8 h-1 bg-gradient-to-r from-transparent via-accent to-accent rounded" />
                <span className="text-sm font-semibold tracking-widest uppercase">Benefits</span>
                <div className="w-8 h-1 bg-gradient-to-l from-transparent via-accent to-accent rounded" />
              </div>
            </div>
            <h2 className="text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-accent via-teal to-primary bg-clip-text text-transparent">
              Why Choose CraftConnect?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="p-10 text-center border-2 hover:border-primary transition-all duration-500 hover-lift group overflow-hidden relative animate-fade-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-bounce-subtle">🎨</div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Authentic Crafts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every product is handmade by skilled artisans using traditional techniques passed down through generations
              </p>
            </Card>
            <Card className="p-10 text-center border-2 hover:border-primary transition-all duration-500 hover-lift group overflow-hidden relative animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>🤝</div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Direct Connection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Buy directly from artisans and support their livelihoods while preserving cultural heritage
              </p>
            </Card>
            <Card className="p-10 text-center border-2 hover:border-primary transition-all duration-500 hover-lift group overflow-hidden relative animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-bounce-subtle" style={{ animationDelay: '1s' }}>✨</div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Quality Assured</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each product is carefully curated and quality-checked to ensure excellence in every piece
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
