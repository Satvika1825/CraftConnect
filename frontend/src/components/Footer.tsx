import { Heart, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-muted to-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <h3 className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                CraftConnect
              </h3>
            </div>
            <p className="body-text mb-6 leading-relaxed">
              Connecting authentic Indian handicrafts with art lovers worldwide. 
              Supporting village artisans and preserving cultural heritage.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 shadow-soft">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 shadow-soft">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 shadow-soft">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="heading-tertiary text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              <li><a href="#" className="body-text hover:text-primary transition-colors">Pottery</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Textiles</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Jewelry</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Wood Carving</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Embroidery</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="heading-tertiary text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="body-text hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="body-text hover:text-primary transition-colors">Care Instructions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="heading-tertiary text-lg mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="body-text">support@craftconnect.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="body-text">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="body-text">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="body-text text-center md:text-left">
            © 2024 CraftConnect. Made with <Heart className="w-4 h-4 inline text-primary" /> for Indian artisans.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;