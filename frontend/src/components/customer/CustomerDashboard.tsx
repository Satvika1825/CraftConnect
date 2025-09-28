import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Filter } from 'lucide-react';
import craftsCollection from '@/assets/crafts-collection.jpg';

const CustomerDashboard: React.FC = () => {
  const categories = [
    { name: 'Pottery', count: 156, icon: '🏺' },
    { name: 'Textiles', count: 89, icon: '🧶' },
    { name: 'Jewelry', count: 234, icon: '💍' },
    { name: 'Wood Crafts', count: 67, icon: '🪵' },
    { name: 'Metal Work', count: 45, icon: '🔧' },
    { name: 'Paintings', count: 123, icon: '🎨' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Handcrafted Terracotta Vase',
      artisan: 'Kamala Devi',
      price: 1250,
      rating: 4.8,
      reviews: 23,
      image: '🏺',
      location: 'Rajasthan',
    },
    {
      id: 2,
      name: 'Embroidered Silk Dupatta',
      artisan: 'Meera Sharma',
      price: 2800,
      rating: 4.9,
      reviews: 45,
      image: '🧣',
      location: 'Gujarat',
    },
    {
      id: 3,
      name: 'Brass Meditation Bowl',
      artisan: 'Ravi Kumar',
      price: 1850,
      rating: 4.7,
      reviews: 18,
      image: '🥣',
      location: 'Kerala',
    },
    {
      id: 4,
      name: 'Madhubani Painting',
      artisan: 'Sunita Jha',
      price: 3200,
      rating: 4.9,
      reviews: 67,
      image: '🖼️',
      location: 'Bihar',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${craftsCollection})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-craft-terracotta/80 to-craft-deep-red/60 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-serif font-bold mb-4">
                  Discover Authentic Indian Handicrafts
                </h1>
                <p className="text-lg mb-6 opacity-90">
                  Connect directly with skilled artisans and bring home the beauty of traditional craftsmanship
                </p>
                <Button variant="secondary" size="lg" className="craft-button">
                  Explore Collections
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div>
        <h2 className="text-2xl font-serif font-semibold mb-6 text-craft-terracotta">
          Shop by Craft
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="craft-card hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count} items</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-craft-terracotta">
            Featured Crafts
          </h2>
          <Button variant="craftOutline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="craft-card hover:scale-105 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-craft-beige to-craft-mustard/20 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      by {product.artisan} • {product.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-craft-mustard text-craft-mustard" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-craft-terracotta">
                      ₹{product.price.toLocaleString()}
                    </div>
                    <Button size="sm" variant="craft" className="text-xs">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="craft-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-craft-terracotta mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Authentic Products</div>
          </CardContent>
        </Card>
        <Card className="craft-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-craft-mustard mb-2">150+</div>
            <div className="text-sm text-muted-foreground">Skilled Artisans</div>
          </CardContent>
        </Card>
        <Card className="craft-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-craft-teal mb-2">25+</div>
            <div className="text-sm text-muted-foreground">Indian States</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;