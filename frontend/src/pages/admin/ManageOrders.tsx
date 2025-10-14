import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
  }|null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://craftconnect-bbdp.onrender.com-api/order-api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`https://craftconnect-bbdp.onrender.com-api/order-api/orders/${orderId}/status`, {
        status: newStatus
      });

      setOrders(current =>
        current.map(order =>
          order._id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      );

      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold">Manage Orders</h1>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
                      <p className="font-medium">{order.userId?.name || 'Unknown Customer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.userId?.email || 'No email provided'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-lg">₹{order.total}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {order.items.map((item) => (
                    <div key={item.productId?._id || 'deleted'} className="flex gap-4 p-4 border rounded">
                      {item.productId ? (
                        <>
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.productId.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                            <p className="font-bold">₹{item.price}</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-muted-foreground">Product no longer available</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && <Package className="text-yellow-500" />}
                      {order.status === 'confirmed' && <CheckCircle className="text-blue-500" />}
                      {order.status === 'shipped' && <Truck className="text-purple-500" />}
                      {order.status === 'delivered' && <CheckCircle className="text-green-500" />}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateStatus(order._id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
