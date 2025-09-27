import { Heart, Star, ShoppingCart } from "lucide-react";
import craftsImage from "@/assets/crafts-collection.jpg";

const products = [
  {
    id: 1,
    name: "Handwoven Silk Scarf",
    artisan: "Priya Sharma",
    village: "Varanasi, UP",
    price: 1250,
    originalPrice: 1500,
    rating: 4.8,
    reviews: 24,
    image: craftsImage,
    craft: "Textiles"
  },
  {
    id: 2,
    name: "Terracotta Elephant Figurine",
    artisan: "Ravi Kumar",
    village: "Khurja, UP", 
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviews: 18,
    image: craftsImage,
    craft: "Pottery"
  },
  {
    id: 3,
    name: "Embroidered Wall Hanging",
    artisan: "Meera Devi",
    village: "Kutch, Gujarat",
    price: 890,
    originalPrice: 1100,
    rating: 4.7,
    reviews: 31,
    image: craftsImage,
    craft: "Embroidery"
  },
  {
    id: 4,
    name: "Wooden Jewelry Box",
    artisan: "Suresh Pal",
    village: "Saharanpur, UP",
    price: 2200,
    originalPrice: 2800,
    rating: 4.9,
    reviews: 15,
    image: craftsImage,
    craft: "Wood Carving"
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">Featured Handicrafts</h2>
          <p className="body-text-large max-w-2xl mx-auto">
            Discover exceptional pieces from our most talented artisans, 
            each item telling a unique story of tradition and craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="craft-card group overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-soft hover:shadow-warm transition-all hover:scale-110">
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </button>

                {/* Craft Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {product.craft}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="heading-tertiary text-lg mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                {/* Artisan Info */}
                <div className="text-sm text-muted-foreground mb-3">
                  <p>by {product.artisan}</p>
                  <p>{product.village}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full craft-button-primary flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="craft-button-accent">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;