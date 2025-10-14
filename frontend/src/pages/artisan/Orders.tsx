import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useUser } from '@clerk/clerk-react';
import { Package, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
    artisanId: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [artisanId, setArtisanId] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Get user's MongoDB ID
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com-api/user-api/user/${user.id}`);
        if (!userResponse.data?._id) {
          toast.error('User not found');
          return;
        }

        // Get artisan details
        const artisanResponse = await axios.get(`https://craftconnect-bbdp.onrender.com-api/artisan-api/artisans`, {
          params: { userId: userResponse.data._id }
        });
        
        if (!artisanResponse.data?._id) {
          toast.error('Artisan not found');
          return;
        }

        // Set artisan ID first
        setArtisanId(artisanResponse.data._id);

        // Then fetch orders for this artisan
        const ordersResponse = await axios.get(
          `https://craftconnect-bbdp.onrender.com-api/order-api/orders/artisan/${artisanResponse.data._id}`
        );

        console.log('Fetched orders:', ordersResponse.data); // Debug log
        setOrders(ordersResponse.data);

      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Package className="h-5 w-5 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
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
        <h1 className="text-4xl font-serif font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No orders yet. Your orders will appear here once customers start buying your products.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID: {order._id}</p>
                      <p className="font-medium">Customer: {order.userId.name}</p>
                      <p className="text-sm text-muted-foreground">{order.userId.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-lg">₹{order.total}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {order.items
                      .filter(item => item.productId.artisanId === artisanId)
                      .map((item) => (
                        <div key={item.productId._id} className="flex gap-4 p-4 border rounded">
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
                        </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
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
