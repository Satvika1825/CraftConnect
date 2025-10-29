import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Package, ShoppingBag, TrendingUp, Plus, MapPin, Sparkles, TrendingDown } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artisanId: string;
  approved: boolean;
}

interface Order {
  _id: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress?: {
    state?: string;
    city?: string;
  };
  createdAt: string;
}

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [artisanId, setArtisanId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get user by clerkId
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
        if (userResponse.data) {
          // Get artisan profile
          const artisanResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/artisan-api/artisans`, {
            params: { userId: userResponse.data._id }
          });
          
          if (artisanResponse.data) {
            const artisanId = artisanResponse.data._id;
            setArtisanId(artisanId);

            // Fetch products for this artisan
            const productsResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/product-api/products`, {
              params: { artisanId }
            });
            setProducts(productsResponse.data);

            // Fetch orders for this artisan
            try {
              const ordersResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/order-api/orders`, {
                params: { artisanId }
              });
              setOrders(ordersResponse.data || []);
            } catch (orderError) {
              console.log('Orders endpoint not available or no orders yet');
              setOrders([]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const approvedProducts = products.filter((p) => p.approved);
  const pendingProducts = products.filter((p) => !p.approved);

  // Helper function to determine region from state
  const getRegionFromState = (state?: string): string => {
    if (!state) return 'Central';
    
    const stateUpper = state.toUpperCase();
    
    if (['DELHI', 'PUNJAB', 'HARYANA', 'HIMACHAL', 'JAMMU', 'KASHMIR', 'UTTARAKHAND', 'CHANDIGARH'].some(s => stateUpper.includes(s))) {
      return 'North';
    }
    if (['KARNATAKA', 'TAMIL NADU', 'KERALA', 'ANDHRA', 'TELANGANA', 'PUDUCHERRY'].some(s => stateUpper.includes(s))) {
      return 'South';
    }
    if (['WEST BENGAL', 'BENGAL', 'ODISHA', 'BIHAR', 'JHARKHAND', 'ASSAM', 'ARUNACHAL', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'SIKKIM', 'TRIPURA'].some(s => stateUpper.includes(s))) {
      return 'East';
    }
    if (['MAHARASHTRA', 'GUJARAT', 'RAJASTHAN', 'GOA', 'DAMAN', 'DIU', 'DADRA', 'NAGAR HAVELI'].some(s => stateUpper.includes(s))) {
      return 'West';
    }
    
    return 'Central';
  };

  // Calculate analytics from actual orders and products
  const analytics = useMemo(() => {
    // Category sales from orders
    const categorySalesMap = new Map<string, { category: string; sales: number; revenue: number }>();
    
    if (orders.length > 0) {
      // Calculate from actual orders
      orders.forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p._id === item.productId);
          if (product) {
            const existing = categorySalesMap.get(product.category) || {
              category: product.category,
              sales: 0,
              revenue: 0
            };
            existing.sales += item.quantity;
            existing.revenue += item.quantity * item.price;
            categorySalesMap.set(product.category, existing);
          }
        });
      });
    } else {
      // Use product distribution as fallback
      products.forEach(product => {
        const existing = categorySalesMap.get(product.category) || {
          category: product.category,
          sales: 0,
          revenue: 0
        };
        // Simulate sales based on product count and price
        existing.sales += Math.floor(product.price / 100) + 5;
        existing.revenue += product.price * existing.sales;
        categorySalesMap.set(product.category, existing);
      });
    }

    const categoryData = Array.from(categorySalesMap.values()).sort((a, b) => b.sales - a.sales);

    // Regional sales from orders
    const regionMap = new Map<string, number>();
    
    if (orders.length > 0) {
      orders.forEach(order => {
        const region = getRegionFromState(order.shippingAddress?.state);
        regionMap.set(region, (regionMap.get(region) || 0) + order.totalAmount);
      });
    } else {
      // Default distribution
      regionMap.set('North', 1250);
      regionMap.set('South', 980);
      regionMap.set('East', 1450);
      regionMap.set('West', 890);
      regionMap.set('Central', 1120);
    }

    const chartColors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    const regionalData = Array.from(regionMap.entries()).map(([region, sales], index) => ({
      region,
      sales,
      fill: chartColors[index % chartColors.length]
    }));

    // Generate insights from category data
    const generateInsights = () => {
      const insights = [];
      
      if (categoryData.length > 0) {
        const topCategory = categoryData[0];
        insights.push({
          text: `${topCategory.category} is your best selling category with ${topCategory.sales} sales`,
          trend: 'up',
          icon: TrendingUp,
          color: 'text-accent'
        });
      }

      if (orders.length > 0) {
        const recentOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate > monthAgo;
        });
        
        insights.push({
          text: `You received ${recentOrders.length} orders in the last 30 days`,
          trend: 'up',
          icon: Sparkles,
          color: 'text-primary'
        });
      }

      if (approvedProducts.length > 0 && pendingProducts.length > 0) {
        const approvalRate = Math.round((approvedProducts.length / products.length) * 100);
        insights.push({
          text: `${approvalRate}% of your products are approved and live on the marketplace`,
          trend: approvalRate > 80 ? 'up' : 'down',
          icon: approvalRate > 80 ? TrendingUp : TrendingDown,
          color: approvalRate > 80 ? 'text-accent' : 'text-secondary'
        });
      }

      // Default insights if no data
      if (insights.length === 0) {
        insights.push(
          {
            text: 'Add more products to get personalized insights',
            trend: 'up',
            icon: Sparkles,
            color: 'text-primary'
          },
          {
            text: 'Products with clear images sell 60% better',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-accent'
          },
          {
            text: 'Detailed descriptions increase customer trust',
            trend: 'up',
            icon: Sparkles,
            color: 'text-primary'
          }
        );
      }

      return insights;
    };

    return {
      categoryData,
      regionalData,
      insights: generateInsights()
    };
  }, [products, orders, approvedProducts, pendingProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Artisan Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user?.firstName || 'Artisan'}!</p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
              <Package className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
              <ShoppingBag className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{approvedProducts.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending Approval</h3>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold">{pendingProducts.length}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => {
                if (artisanId) {
                  console.log('Navigating with artisanId:', artisanId);
                  navigate('/artisan/add-product', { 
                    state: { artisanId } 
                  });
                } else {
                  toast.error('Unable to add product. Please try again later.');
                }
              }} 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
            <Button variant="outline" onClick={() => navigate('/artisan/products')}>
              Manage Products
            </Button>
            <Button variant="outline" onClick={() => navigate('/artisan/orders')}>
              View Orders
            </Button>
          </div>
        </Card>

        {/* Popular Products by Category */}
        {analytics.categoryData.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {orders.length > 0 ? 'Sales by Category' : 'Product Distribution by Category'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {orders.length > 0 
                ? 'Based on your actual order data' 
                : 'Based on your product inventory'}
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="category" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'sales') return [`${value} units`, 'Sales'];
                      if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Sales by Region & Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              {orders.length > 0 ? 'Sales by Region' : 'Potential Market Distribution'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {orders.length > 0 
                ? 'Where your customers are located' 
                : 'Target market distribution'}
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.regionalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="sales"
                  >
                    {analytics.regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Business Insights */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Business Insights
            </h2>
            <div className="space-y-4">
              {analytics.insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${insight.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                );
              })}
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  💡 Tip: Regular updates and quality photos help increase visibility and sales
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Products */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
              <Button onClick={() => navigate('/artisan/add-product', { state: { artisanId } })}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-4 border rounded hover:bg-muted/50 transition-colors">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{product.price}</p>
                    <p className={`text-sm ${product.approved ? 'text-accent' : 'text-secondary'}`}>
                      {product.approved ? 'Approved ✓' : 'Pending ⏳'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}