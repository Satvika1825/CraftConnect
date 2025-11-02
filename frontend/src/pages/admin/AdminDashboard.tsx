import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingBag, TrendingUp, CircleDot, AlertCircle, DollarSign, Activity, Bell } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

interface DashboardStats {
  totalUsers: number;
  totalArtisans: number;
  totalCustomers: number;
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingArtisans: number;
}

interface Activity {
  _id: string;
  type: 'user_registered' | 'product_added' | 'product_approved' | 'order_placed';
  message: string;
  createdAt: string;
}

interface ChartData {
  name: string;
  value: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArtisans: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingArtisans: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        toast.error('Please login to access admin dashboard');
        navigate('/');
        return;
      }

      try {
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
        if (userResponse.data.role !== 'admin') {
          toast.error('Access denied. Admin only.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        toast.error('Failed to verify admin access');
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [usersRes, productsRes, ordersRes, activitiesRes] = await Promise.all([
          axios.get('https://craftconnect-bbdp.onrender.com/user-api/users'),
          axios.get('https://craftconnect-bbdp.onrender.com/product-api/products'),
          axios.get('https://craftconnect-bbdp.onrender.com/order-api/orders'),
          axios.get('https://craftconnect-bbdp.onrender.com/admin-api/activities').catch(() => ({ data: [] }))
        ]);

        const users = usersRes.data;
        const products = productsRes.data;
        const orders = ordersRes.data;

        // Calculate stats
        const artisans = users.filter((u: any) => u.role === 'artisan');
        const customers = users.filter((u: any) => u.role === 'customer');
        const pendingArtisans = artisans.filter((a: any) => !a.approved).length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

        setStats({
          totalUsers: users.length,
          totalArtisans: artisans.length,
          totalCustomers: customers.length,
          totalProducts: products.length,
          pendingProducts: products.filter((p: any) => !p.approved).length,
          approvedProducts: products.filter((p: any) => p.approved).length,
          totalOrders: orders.length,
          totalRevenue,
          pendingArtisans
        });

        setActivities(activitiesRes.data);

        // Category distribution
        const categories = products.reduce((acc: any, product: any) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        setCategoryData(
          Object.entries(categories).map(([name, value]) => ({
            name,
            value: value as number
          }))
        );

        // Revenue by month (mock data - you can calculate from real orders)
        setRevenueData([
          { name: 'Jan', value: Math.floor(totalRevenue * 0.1) },
          { name: 'Feb', value: Math.floor(totalRevenue * 0.12) },
          { name: 'Mar', value: Math.floor(totalRevenue * 0.15) },
          { name: 'Apr', value: Math.floor(totalRevenue * 0.18) },
          { name: 'May', value: Math.floor(totalRevenue * 0.2) },
          { name: 'Jun', value: Math.floor(totalRevenue * 0.25) }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_registered': return <Users className="h-4 w-4" />;
      case 'product_added': return <Package className="h-4 w-4" />;
      case 'product_approved': return <TrendingUp className="h-4 w-4" />;
      case 'order_placed': return <ShoppingBag className="h-4 w-4" />;
      default: return <CircleDot className="h-4 w-4" />;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage CraftConnect platform</p>
          </div>
          <Button onClick={() => navigate('/admin/announcements')} className="gap-2">
            <Bell className="h-4 w-4" />
            Manage Announcements
          </Button>
        </div>

        {/* Alert Cards for Pending Items */}
        {(stats.pendingProducts > 0 || stats.pendingArtisans > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {stats.pendingProducts > 0 && (
              <Card className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-900">
                        {stats.pendingProducts} Products Awaiting Approval
                      </p>
                      <p className="text-sm text-yellow-700">Review and approve new product listings</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate('/admin/products')}
                  >
                    Review
                  </Button>
                </div>
              </Card>
            )}

            {stats.pendingArtisans > 0 && (
              <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        {stats.pendingArtisans} Artisan Accounts Pending
                      </p>
                      <p className="text-sm text-blue-700">Approve artisan registrations</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate('/admin/users')}
                  >
                    Review
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalArtisans} Artisans · {stats.totalCustomers} Customers
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/products')}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Products</h3>
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.approvedProducts} Approved · {stats.pendingProducts} Pending
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">All time orders</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">↑ Platform earnings</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h2>
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="text-muted-foreground">
                    {getActivityIcon(activity.type)}
                  </div>
                  <p className="flex-1">{activity.message}</p>
                  <span className="text-muted-foreground text-sm">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
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