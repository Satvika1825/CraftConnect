import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package, TrendingUp, AlertTriangle, CheckCircle, Clock, Truck } from 'lucide-react';

const AdminOrderManagement: React.FC = () => {
  const orders = [
    {
      id: "ORD-001",
      customer: "Rajesh Kumar",
      artisan: "Kumar Pottery",
      product: "Terracotta Pot Set",
      amount: "₹850",
      status: "processing",
      date: "2024-01-18",
      priority: "normal"
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      artisan: "Meera Textile Arts",
      product: "Handwoven Silk Saree",
      amount: "₹4,500",
      status: "shipped",
      date: "2024-01-17",
      priority: "high"
    },
    {
      id: "ORD-003",
      customer: "Amit Patel",
      artisan: "Traditional Crafts",
      product: "Wooden Elephant Sculpture",
      amount: "₹2,200",
      status: "delivered",
      date: "2024-01-15",
      priority: "normal"
    },
    {
      id: "ORD-004",
      customer: "Sunita Gupta",
      artisan: "Heritage Metalworks",
      product: "Brass Diya Collection",
      amount: "₹1,200",
      status: "disputed",
      date: "2024-01-14",
      priority: "urgent"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'default';
      case 'shipped': return 'secondary';
      case 'delivered': return 'default';
      case 'disputed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'normal': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'disputed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          Order Management
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage all platform orders
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-craft-terracotta" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">₹2.4L</div>
            <div className="text-sm text-muted-foreground">Revenue (Month)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Disputes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="disputed">Disputed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">#{order.id}</h3>
                          <Badge variant={getStatusColor(order.status)} className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <Badge variant={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <strong>Customer:</strong> {order.customer} • <strong>Artisan:</strong> {order.artisan}
                        </div>
                        
                        <div className="text-sm">
                          <strong>Product:</strong> {order.product}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Order Date: {order.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-craft-terracotta">{order.amount}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        
                        {order.status === 'disputed' && (
                          <Button size="sm" variant="craft">
                            Resolve
                          </Button>
                        )}
                        
                        {order.status === 'processing' && (
                          <Button size="sm" variant="outline">
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would show filtered results */}
        <TabsContent value="disputed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disputed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(order => order.status === 'disputed').map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center space-x-4 flex-1">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">#{order.id}</h3>
                          <Badge variant="destructive">URGENT</Badge>
                        </div>
                        <div className="text-sm">
                          <strong>Issue:</strong> Customer claims product quality issues
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer} • {order.product} • {order.amount}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="craft">
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        Contact Parties
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrderManagement;
