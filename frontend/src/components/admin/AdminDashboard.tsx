import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';

interface AdminDashboardProps {
  onViewChange: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewChange }) => {
  const platformStats = [
    {
      title: 'Total Users',
      value: 2847,
      change: '+12% this month',
      icon: Users,
      color: 'craft-terracotta',
    },
    {
      title: 'Active Products',
      value: 1456,
      change: '+8% this month',
      icon: Package,
      color: 'craft-mustard',
    },
    {
      title: 'Total Orders',
      value: 892,
      change: '+23% this month',
      icon: ShoppingCart,
      color: 'craft-teal',
    },
    {
      title: 'Revenue',
      value: '₹12,45,670',
      change: '+18% this month',
      icon: DollarSign,
      color: 'craft-deep-red',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Product',
      item: 'Handwoven Silk Saree',
      artisan: 'Lakshmi Devi',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      id: 2,
      type: 'Artisan',
      item: 'Rohit Kumar',
      artisan: 'Self',
      date: '2024-01-14',
      status: 'pending',
    },
    {
      id: 3,
      type: 'Product',
      item: 'Brass Decorative Plate',
      artisan: 'Suresh Metalworks',
      date: '2024-01-13',
      status: 'pending',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New artisan registration',
      user: 'Meera Sharma',
      time: '2 hours ago',
      type: 'user',
    },
    {
      id: 2,
      action: 'Product approved',
      user: 'Kamala Pottery',
      time: '4 hours ago',
      type: 'approval',
    },
    {
      id: 3,
      action: 'Large order placed',
      user: 'Corporate Client',
      time: '6 hours ago',
      type: 'order',
    },
    {
      id: 4,
      action: 'Artisan suspended',
      user: 'Fake Crafts Ltd',
      time: '1 day ago',
      type: 'warning',
    },
  ];

  const userStats = [
    { role: 'Customers', count: 2456, percentage: 86.2 },
    { role: 'Artisans', count: 348, percentage: 12.2 },
    { role: 'Admins', count: 43, percentage: 1.6 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'approval': return CheckCircle;
      case 'order': return ShoppingCart;
      case 'warning': return AlertTriangle;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-500';
      case 'approval': return 'text-green-500';
      case 'order': return 'text-purple-500';
      case 'warning': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-craft-deep-red to-craft-terracotta rounded-lg p-6 text-white">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Platform Administration 👑
        </h1>
        <p className="text-lg opacity-90">
          Manage the CraftConnect marketplace and support our artisan community
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat) => {
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

      {/* Quick Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewChange('manage-users')}>
          <CardContent className="p-6 text-center">
            <Users className="h-10 w-10 text-craft-terracotta mx-auto mb-3" />
            <h3 className="font-semibold text-sm">Manage Users</h3>
          </CardContent>
        </Card>
        
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewChange('manage-products')}>
          <CardContent className="p-6 text-center">
            <Package className="h-10 w-10 text-craft-mustard mx-auto mb-3" />
            <h3 className="font-semibold text-sm">Manage Products</h3>
          </CardContent>
        </Card>
        
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewChange('manage-orders')}>
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-10 w-10 text-craft-teal mx-auto mb-3" />
            <h3 className="font-semibold text-sm">Manage Orders</h3>
          </CardContent>
        </Card>
        
        <Card className="craft-card cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-craft-deep-red mx-auto mb-3" />
            <h3 className="font-semibold text-sm">
              Approvals ({pendingApprovals.length})
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals */}
        <Card className="craft-card">
          <CardHeader>
            <CardTitle className="text-craft-terracotta flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h4 className="font-medium text-sm">{item.item}</h4>
                  <p className="text-xs text-muted-foreground">by {item.artisan}</p>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="craft" className="h-8 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="craft-card">
          <CardHeader>
            <CardTitle className="text-craft-terracotta">Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border border-border/50 rounded-lg">
                  <Icon className={`h-4 w-4 mt-0.5 ${getActivityColor(activity.type)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="craft-card">
          <CardHeader>
            <CardTitle className="text-craft-terracotta">User Distribution</CardTitle>
            <CardDescription>Platform user breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userStats.map((stat) => (
              <div key={stat.role} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stat.role}</span>
                  <span className="text-muted-foreground">{stat.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-craft-terracotta h-2 rounded-full transition-all"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {stat.percentage}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;