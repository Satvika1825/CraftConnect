import { Search, ShoppingCart, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              CraftConnect
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="body-text hover:text-primary transition-colors">Home</Link>
            <Link to="/crafts" className="body-text hover:text-primary transition-colors">Crafts</Link>
            <Link to="/artisans" className="body-text hover:text-primary transition-colors">Artisans</Link>
            <a href="#about" className="body-text hover:text-primary transition-colors">About</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex relative max-w-md flex-1 mx-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search crafts, artisans..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/favorites" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-muted rounded-lg transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-muted-foreground hover:text-primary" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">3</span>
            </Link>
            <Link to="/profile" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <User className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;