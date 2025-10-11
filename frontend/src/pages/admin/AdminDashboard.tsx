import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Users, Package, ShoppingBag, TrendingUp, CircleDot } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
}

interface Activity {
  _id: string;
  type: 'user_registered' | 'product_added' | 'product_approved' | 'order_placed';
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [usersRes, productsRes, activitiesRes] = await Promise.all([
          axios.get('http://localhost:3000/user-api/users'),
          axios.get('http://localhost:3000/product-api/products'),
          axios.get('http://localhost:3000/admin-api/activities')
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalProducts: productsRes.data.length,
          pendingProducts: productsRes.data.filter((p: any) => !p.approved).length,
          approvedProducts: productsRes.data.filter((p: any) => p.approved).length
        });

        setActivities(activitiesRes.data);
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
        <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage CraftConnect platform</p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-2">Registered users</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
              <Package className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">All products</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending Approval</h3>
              <ShoppingBag className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold">{stats.pendingProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{stats.approvedProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">Live products</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          {activities.length === 0 ? (
            <p className="text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity._id} className="flex items-center gap-3 text-sm">
                  <div className="text-muted-foreground">
                    {getActivityIcon(activity.type)}
                  </div>
                  <p>{activity.message}</p>
                  <span className="text-muted-foreground ml-auto">
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