import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Heart, ShoppingCart, Star } from 'lucide-react';
import productsShowcase from '@/assets/products-showcase.jpg';
import textileArt from '@/assets/textile-art.jpg';

const ProductCatalog: React.FC = () => {
  const products = [
    {
      id: 1,
      name: "Handwoven Silk Saree",
      artisan: "Priya Textile Arts",
      price: "₹4,500",
      rating: 4.8,
      image: textileArt,
      category: "Textiles",
      location: "Varanasi, UP"
    },
    {
      id: 2,
      name: "Terracotta Pot Set",
      artisan: "Kumar Pottery",
      price: "₹850",
      rating: 4.6,
      image: productsShowcase,
      category: "Pottery",
      location: "Khurja, UP"
    },
    {
      id: 3,
      name: "Wooden Elephant Sculpture",
      artisan: "Traditional Crafts",
      price: "₹2,200",
      rating: 4.9,
      image: productsShowcase,
      category: "Wood Carving",
      location: "Channapatna, KA"
    },
    {
      id: 4,
      name: "Brass Diya Collection",
      artisan: "Heritage Metalworks",
      price: "₹1,200",
      rating: 4.7,
      image: productsShowcase,
      category: "Metalwork",
      location: "Moradabad, UP"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          Discover Authentic Crafts
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collection of handmade treasures from skilled artisans across India
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="woodwork">Wood Carving</SelectItem>
                <SelectItem value="metalwork">Metalwork</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                <SelectItem value="1000-3000">₹1,000 - ₹3,000</SelectItem>
                <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                <SelectItem value="above-5000">Above ₹5,000</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="up">Uttar Pradesh</SelectItem>
                <SelectItem value="ka">Karnataka</SelectItem>
                <SelectItem value="rj">Rajasthan</SelectItem>
                <SelectItem value="gj">Gujarat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Badge className="absolute top-2 left-2" variant="secondary">
                {product.category}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-craft-deep-red group-hover:text-craft-terracotta transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">{product.artisan}</p>
                <p className="text-xs text-craft-mustard">{product.location}</p>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-craft-mustard text-craft-mustard" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">(124 reviews)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-craft-terracotta">
                  {product.price}
                </span>
                <Button size="sm" variant="craft">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Products
        </Button>
      </div>
    </div>
  );
};

export default ProductCatalog;