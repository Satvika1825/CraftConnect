import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const favorites = [
    {
      id: 1,
      name: "Hand-painted Pottery Vase",
      artisan: "Meera Sharma",
      village: "Khurja, UP",
      price: "₹2,500",
      originalPrice: "₹3,000",
      image: "/placeholder.svg",
      category: "Pottery"
    },
    {
      id: 2,
      name: "Traditional Silk Saree",
      artisan: "Ravi Kumar",
      village: "Banaras, UP", 
      price: "₹8,500",
      image: "/placeholder.svg",
      category: "Textiles"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">My Favorites</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="heading-secondary mb-2">My Favorite Items</h1>
              <p className="body-text">You have {favorites.length} items in your wishlist</p>
            </div>
            
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="craft-card group cursor-pointer relative">
                  {/* Remove from favorites */}
                  <button className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                  
                  <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="heading-tertiary mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {item.artisan} • {item.village}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-primary">{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
                      )}
                    </div>
                    <button className="w-full craft-button-primary flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="heading-tertiary mb-4">No favorites yet</h3>
              <p className="body-text mb-6">Start adding items to your wishlist to see them here</p>
              <Link to="/crafts" className="craft-button-primary">
                Explore Crafts
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;