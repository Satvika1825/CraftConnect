import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { products } = useStore();
  
  const pendingProducts = products.filter((p) => !p.approved).length;
  const approvedProducts = products.filter((p) => p.approved).length;

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
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-2">Registered users</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
              <Package className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{products.length}</p>
            <p className="text-xs text-muted-foreground mt-2">All products</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending Approval</h3>
              <ShoppingBag className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold">{pendingProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{approvedProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">Live products</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Activity log will appear here</p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
