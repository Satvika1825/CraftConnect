import heroImage from "@/assets/hero-artisan.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Indian artisan crafting pottery in traditional village setting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 texture-pattern opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="heading-primary text-white mb-6 animate-fade-in">
            Discover Authentic
            <span className="block text-transparent bg-gradient-to-r from-earth-rust to-secondary bg-clip-text">
              Indian Handicrafts
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Connect with skilled village artisans and bring home timeless treasures 
            crafted with generations of traditional expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/crafts" className="craft-button-primary">
              Explore Crafts
            </Link>
            <Link to="/artisans" className="craft-button-secondary">
              Meet Artisans
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/80 text-sm">Skilled Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">2,000+</div>
              <div className="text-white/80 text-sm">Handmade Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-white/80 text-sm">Villages Connected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;