import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Package, ShoppingBag, TrendingUp, Plus, MapPin, Sparkles, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
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

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [artisanId, setArtisanId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
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

  // Calculate popular products by category
  const categoryData = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = { category, sales: 0, revenue: 0 };
    }
    // Mock sales data based on product price (higher price = more popular for demo)
    acc[category].sales += Math.floor(Math.random() * 50) + 10;
    acc[category].revenue += product.price * acc[category].sales;
    return acc;
  }, {} as Record<string, { category: string; sales: number; revenue: number }>);

  const popularProductsData = Object.values(categoryData).sort((a, b) => b.sales - a.sales);

  // Mock regional sales data
  const regionalSalesData = [
    { region: 'North', sales: 1250, fill: 'hsl(var(--chart-1))' },
    { region: 'South', sales: 980, fill: 'hsl(var(--chart-2))' },
    { region: 'East', sales: 1450, fill: 'hsl(var(--chart-3))' },
    { region: 'West', sales: 890, fill: 'hsl(var(--chart-4))' },
    { region: 'Central', sales: 1120, fill: 'hsl(var(--chart-5))' },
  ];

  // Seasonal insights
  const insights = [
    { 
      text: 'Pottery products sell 40% more during festival season',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      text: 'Jewelry has highest demand in wedding season',
      trend: 'up',
      icon: Sparkles,
      color: 'text-primary'
    },
    {
      text: 'Summer sees 25% drop in woolen crafts',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-secondary'
    }
  ];

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
        {popularProductsData.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular Products by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularProductsData}>
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
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Sales by Region & Seasonal Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Sales Heatmap by Region
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionalSalesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="sales"
                  >
                    {regionalSalesData.map((entry, index) => (
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

          {/* Seasonal Insights */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Seasonal Insights
            </h2>
            <div className="space-y-4">
              {insights.map((insight, index) => {
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
                  💡 Tip: Stock up on festival items 2 months before peak season for maximum sales
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Products */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground">You haven't added any products yet.</p>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-4 border rounded">
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
                      {product.approved ? 'Approved' : 'Pending'}
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