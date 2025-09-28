import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, MapPin, Phone, Mail, Calendar, Package, Heart } from 'lucide-react';

const CustomerProfile: React.FC = () => {
  const recentOrders = [
    {
      id: "ORD001",
      date: "2024-01-15",
      status: "Delivered",
      total: "₹4,500",
      items: 1
    },
    {
      id: "ORD002", 
      date: "2024-01-10",
      status: "In Transit",
      total: "₹1,200",
      items: 2
    }
  ];

  const favoriteArtisans = [
    { name: "Priya Textile Arts", location: "Varanasi, UP", products: 15 },
    { name: "Kumar Pottery", location: "Khurja, UP", products: 8 },
    { name: "Heritage Metalworks", location: "Moradabad, UP", products: 12 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Avatar className="h-24 w-24 mx-auto">
          <AvatarFallback className="bg-craft-terracotta text-white text-2xl">
            👤
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-serif font-bold text-craft-terracotta">
            Customer Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Rajesh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="rajesh.kumar@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
              </div>
              <Button variant="craft">Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold">#{order.id}</span>
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{order.date}</span>
                        </span>
                        <span>{order.items} item(s)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-craft-terracotta">{order.total}</div>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Favorite Artisans</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favoriteArtisans.map((artisan) => (
                  <div key={artisan.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-craft-deep-red">{artisan.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{artisan.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{artisan.products} products</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Visit Shop
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Saved Addresses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="default" className="mb-2">Default</Badge>
                    <h3 className="font-semibold">Home</h3>
                    <p className="text-sm text-muted-foreground">
                      123 MG Road, Koramangala<br />
                      Bangalore, Karnataka - 560034<br />
                      +91 98765 43210
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add New Address
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerProfile;