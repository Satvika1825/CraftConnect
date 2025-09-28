import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Package, Clock, CheckCircle, XCircle, User, MapPin, Phone } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const orders = [
    {
      id: "ORD-001",
      customer: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 98765 43210",
      product: "Handwoven Silk Saree",
      quantity: 1,
      price: "₹4,500",
      status: "pending",
      date: "2024-01-15",
      address: "123 MG Road, Koramangala, Bangalore - 560034"
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      email: "priya@email.com", 
      phone: "+91 87654 32109",
      product: "Terracotta Pot Set",
      quantity: 2,
      price: "₹1,700",
      status: "processing",
      date: "2024-01-14",
      address: "456 Park Street, Salt Lake, Kolkata - 700064"
    },
    {
      id: "ORD-003",
      customer: "Amit Patel",
      email: "amit@email.com",
      phone: "+91 76543 21098",
      product: "Ceramic Dinner Plates",
      quantity: 1,
      price: "₹1,200",
      status: "shipped",
      date: "2024-01-12",
      address: "789 FC Road, Pune - 411005"
    },
    {
      id: "ORD-004",
      customer: "Sunita Gupta",
      email: "sunita@email.com",
      phone: "+91 65432 10987",
      product: "Wooden Elephant Sculpture",
      quantity: 1,
      price: "₹2,200",
      status: "delivered",
      date: "2024-01-10",
      address: "321 CP, New Delhi - 110001"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">#{order.id}</h3>
              <Badge variant={getStatusColor(order.status)} className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-craft-terracotta">{order.price}</div>
            <div className="text-sm text-muted-foreground">Qty: {order.quantity}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-craft-deep-red">{order.product}</h4>
          </div>

          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-craft-terracotta text-white text-sm">
                {order.customer.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-4 text-sm">
                <span className="font-medium">{order.customer}</span>
                <span className="flex items-center space-x-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{order.phone}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          {order.status === 'pending' && (
            <>
              <Button size="sm" variant="craft" className="flex-1">
                Accept Order
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Contact Customer
              </Button>
            </>
          )}
          {order.status === 'processing' && (
            <>
              <Button size="sm" variant="craft" className="flex-1">
                Mark as Shipped
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Update Status
              </Button>
            </>
          )}
          {(order.status === 'shipped' || order.status === 'delivered') && (
            <Button size="sm" variant="outline" className="w-full">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          Order Management
        </h1>
        <p className="text-muted-foreground">
          Track and manage your customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Shipped</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterOrdersByStatus('pending').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {filterOrdersByStatus('processing').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-4">
          {filterOrdersByStatus('shipped').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {filterOrdersByStatus('delivered').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;