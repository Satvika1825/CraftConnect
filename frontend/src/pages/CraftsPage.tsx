import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Filter, Grid3X3, List } from "lucide-react";
import { Link } from "react-router-dom";

const CraftsPage = () => {
  const crafts = [
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
    },
    // Add more products...
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">All Crafts</span>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-12 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="heading-primary mb-4">Explore All Crafts</h1>
                <p className="body-text-large">Discover authentic Indian handicrafts from skilled village artisans</p>
              </div>
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-8 p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 craft-button-secondary">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <select className="px-3 py-2 border rounded-lg">
                  <option>All Categories</option>
                  <option>Pottery</option>
                  <option>Textiles</option>
                  <option>Wood Carving</option>
                  <option>Jewelry</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">1,247 products</span>
                <div className="flex gap-2">
                  <button className="p-2 border rounded-lg hover:bg-muted">
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 border rounded-lg">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {crafts.map((craft) => (
                <div key={craft.id} className="craft-card group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={craft.image} 
                      alt={craft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="heading-tertiary mb-2 group-hover:text-primary transition-colors">
                      {craft.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {craft.artisan} • {craft.village}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-primary">{craft.price}</span>
                      {craft.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{craft.originalPrice}</span>
                      )}
                    </div>
                    <button className="w-full craft-button-primary">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CraftsPage;