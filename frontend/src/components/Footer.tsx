import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-craft-earth/10 border-t border-craft-terracotta/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-craft-terracotta">
              CraftConnect
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting traditional Indian artisans with the world. Discover authentic handcrafted treasures that tell stories of heritage and skill.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-craft-deep-red fill-current" />
              <span>for Indian crafts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-craft-terracotta">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">How It Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Artisan Stories</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Quality Promise</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Shipping Info</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-craft-terracotta">Craft Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Pottery & Ceramics</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Textiles & Weaving</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Wood Carving</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Metalwork & Jewelry</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-craft-terracotta transition-colors">Traditional Art</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-craft-terracotta">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-craft-mustard" />
                <span className="text-muted-foreground">hello@craftconnect.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-craft-mustard" />
                <span className="text-muted-foreground">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-craft-mustard" />
                <span className="text-muted-foreground">Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-craft-terracotta/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CraftConnect. Preserving traditions, one craft at a time.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-craft-terracotta transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-craft-terracotta transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-craft-terracotta transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;