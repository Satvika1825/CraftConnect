import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, MapPin, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";

const ArtisansPage = () => {
  const artisans = [
    {
      id: 1,
      name: "Meera Sharma",
      craft: "Pottery & Ceramics",
      village: "Khurja, Uttar Pradesh",
      experience: "25 years",
      rating: 4.9,
      reviews: 156,
      image: "/placeholder.svg",
      products: 48,
      specialties: ["Blue Pottery", "Terracotta", "Glazed Ceramics"]
    },
    {
      id: 2,
      name: "Ravi Kumar",
      craft: "Silk Weaving",
      village: "Banaras, Uttar Pradesh",
      experience: "30 years",
      rating: 5.0,
      reviews: 203,
      image: "/placeholder.svg",
      products: 35,
      specialties: ["Banarasi Silk", "Wedding Sarees", "Traditional Weaves"]
    },
    // Add more artisans...
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
            <span className="text-foreground">Meet Our Artisans</span>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-12 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="heading-primary mb-4">Meet Our Artisans</h1>
                <p className="body-text-large">Connect with skilled craftspeople preserving traditional Indian arts</p>
              </div>
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* Artisans Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artisans.map((artisan) => (
                <div key={artisan.id} className="craft-card group cursor-pointer">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <img 
                        src={artisan.image} 
                        alt={artisan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{artisan.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 text-center">
                    <h3 className="heading-tertiary mb-2 group-hover:text-primary transition-colors">
                      {artisan.name}
                    </h3>
                    
                    <p className="text-primary font-medium mb-2">{artisan.craft}</p>
                    
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {artisan.village}
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-accent" />
                        <span>{artisan.experience}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {artisan.products} products
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {artisan.specialties.slice(0, 2).map((specialty) => (
                          <span key={specialty} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full craft-button-primary">
                      View Profile & Shop
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

export default ArtisansPage;