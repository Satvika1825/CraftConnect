import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Star, 
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ArtisanDashboardProps {
  onViewChange: (view: string) => void;
}

const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({ onViewChange }) => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Products',
      value: 12,
      change: '+2 this month',
      icon: Package,
      color: 'craft-terracotta',
    },
    {
      title: 'Total Sales',
      value: '₹45,230',
      change: '+15% from last month',
      icon: DollarSign,
      color: 'craft-mustard',
    },
    {
      title: 'Pending Orders',
      value: 8,
      change: '3 urgent',
      icon: ShoppingCart,
      color: 'craft-teal',
    },
    {
      title: 'Average Rating',
      value: 4.8,
      change: 'Based on 156 reviews',
      icon: Star,
      color: 'craft-deep-red',
    },
  ];

  const recentProducts = [
    {
      id: 1,
      name: 'Handcrafted Terracotta Vase',
      price: 1250,
      stock: 5,
      status: 'active',
      views: 234,
      sales: 12,
    },
    {
      id: 2,
      name: 'Traditional Clay Oil Lamp Set',
      price: 800,
      stock: 0,
      status: 'out-of-stock',
      views: 156,
      sales: 8,
    },
    {
      id: 3,
      name: 'Decorative Pottery Bowl',
      price: 950,
      stock: 3,
      status: 'low-stock',
      views: 189,
      sales: 15,
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Terracotta Vase',
      customer: 'Priya Sharma',
      amount: 1250,
      status: 'pending',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      product: 'Clay Oil Lamp Set',
      customer: 'Raj Kumar',
      amount: 800,
      status: 'shipped',
      date: '2024-01-14',
    },
    {
      id: 'ORD-003',
      product: 'Pottery Bowl',
      customer: 'Anita Desai',
      amount: 950,
      status: 'delivered',
      date: '2024-01-13',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-craft-terracotta to-craft-deep-red rounded-lg p-6 text-white">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Welcome back, {user?.name}! 🏺
        </h1>
        <p className="text-lg opacity-90">
          Your artisan workspace is ready. Let's create something beautiful today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="craft-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 text-${stat.color}`} />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </div>
                  <div className="text-xs text-green-600">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => onViewChange('add-product')}>
          <CardContent className="p-6 text-center">
            <Plus className="h-12 w-12 text-craft-terracotta mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Add New Product</h3>
            <p className="text-sm text-muted-foreground">
              Showcase your latest creation to customers
            </p>
          </CardContent>
        </Card>
        
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewChange('orders')}>
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-12 w-12 text-craft-mustard mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Manage Orders</h3>
            <p className="text-sm text-muted-foreground">
              Process and track customer orders
            </p>
          </CardContent>
        </Card>
        
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewChange('my-products')}>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-craft-teal mx-auto mb-4" />
            <h3 className="font-semibold mb-2">View My Products</h3>
            <p className="text-sm text-muted-foreground">
              Manage your product inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <Card className="craft-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-craft-terracotta">Recent Products</CardTitle>
              <Button variant="craftOutline" size="sm" onClick={() => onViewChange('my-products')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>₹{product.price}</span>
                    <span>{product.stock} in stock</span>
                    <span>{product.views} views</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="craft-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-craft-terracotta">Recent Orders</CardTitle>
              <Button variant="craftOutline" size="sm" onClick={() => onViewChange('orders')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">
                    {order.id} - {order.product}
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    Customer: {order.customer} • {order.date}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-semibold">₹{order.amount}</div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtisanDashboard;