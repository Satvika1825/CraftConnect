import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Edit2, MapPin, Phone, Mail, Package, Heart, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">My Profile</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="heading-secondary">My Profile</h1>
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="craft-card">
                <div className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-warm rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">AK</span>
                  </div>
                  
                  <h3 className="heading-tertiary mb-2">Arjun Kumar</h3>
                  <p className="text-muted-foreground mb-4">Customer since March 2024</p>
                  
                  <button className="w-full craft-button-secondary mb-4 flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>arjun.kumar@email.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <span>123 Arts Street, Delhi, India 110001</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="craft-card text-center">
                  <div className="p-6">
                    <div className="text-2xl font-bold text-primary mb-2">12</div>
                    <div className="text-sm text-muted-foreground">Orders</div>
                  </div>
                </div>
                <div className="craft-card text-center">
                  <div className="p-6">
                    <div className="text-2xl font-bold text-accent mb-2">8</div>
                    <div className="text-sm text-muted-foreground">Favorites</div>
                  </div>
                </div>
                <div className="craft-card text-center">
                  <div className="p-6">
                    <div className="text-2xl font-bold text-secondary mb-2">5</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="craft-card">
                <div className="p-6">
                  <h3 className="heading-tertiary mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/favorites" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
                      <Heart className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">My Favorites</div>
                        <div className="text-sm text-muted-foreground">8 items saved</div>
                      </div>
                    </Link>
                    
                    <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Order History</div>
                        <div className="text-sm text-muted-foreground">12 orders</div>
                      </div>
                    </button>
                    
                    <Link to="/cart" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Shopping Cart</div>
                        <div className="text-sm text-muted-foreground">3 items</div>
                      </div>
                    </Link>
                    
                    <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors">
                      <Settings className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Settings</div>
                        <div className="text-sm text-muted-foreground">Account settings</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="craft-card">
                <div className="p-6">
                  <h3 className="heading-tertiary mb-6">Recent Orders</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((order) => (
                      <div key={order} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg"></div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">Order #CCC00{order}</div>
                          <div className="text-sm text-muted-foreground mb-1">2 items • ₹11,000</div>
                          <div className="text-sm text-primary">Delivered on March {15 + order}, 2024</div>
                        </div>
                        <button className="craft-button-secondary">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;