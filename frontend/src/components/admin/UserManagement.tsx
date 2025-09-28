import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, UserCheck, UserX, MoreVertical, Mail, Phone, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserManagement: React.FC = () => {
  const users = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 98765 43210",
      role: "customer",
      status: "active",
      location: "Bangalore, KA",
      joinDate: "2024-01-15",
      orders: 5,
      avatar: "👤"
    },
    {
      id: 2,
      name: "Ramesh Kumar",
      email: "ramesh@email.com", 
      phone: "+91 87654 32109",
      role: "artisan",
      status: "active",
      location: "Khurja, UP",
      joinDate: "2023-12-20",
      products: 12,
      avatar: "🎨"
    },
    {
      id: 3,
      name: "Priya Sharma",
      email: "priya@email.com",
      phone: "+91 76543 21098",
      role: "customer",
      status: "suspended",
      location: "Mumbai, MH", 
      joinDate: "2024-01-10",
      orders: 2,
      avatar: "👤"
    },
    {
      id: 4,
      name: "Meera Textile Arts",
      email: "meera@email.com",
      phone: "+91 65432 10987",
      role: "artisan",
      status: "pending",
      location: "Varanasi, UP",
      joinDate: "2024-01-18",
      products: 0,
      avatar: "🎨"
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer': return 'default';
      case 'artisan': return 'secondary';
      case 'admin': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'suspended': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage customers, artisans, and platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-craft-terracotta" />
            <div className="text-2xl font-bold">247</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">189</div>
            <div className="text-sm text-muted-foreground">Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-craft-mustard">45</div>
            <div className="text-sm text-muted-foreground">Artisans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserX className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">13</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="User Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="artisan">Artisans</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="up">Uttar Pradesh</SelectItem>
                <SelectItem value="ka">Karnataka</SelectItem>
                <SelectItem value="mh">Maharashtra</SelectItem>
                <SelectItem value="rj">Rajasthan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-craft-terracotta text-white">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-craft-deep-red">{user.name}</h3>
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Joined: {user.joinDate}</span>
                      {user.role === 'customer' && <span>Orders: {user.orders}</span>}
                      {user.role === 'artisan' && <span>Products: {user.products}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {user.status === 'active' && (
                    <Button size="sm" variant="outline" className="text-red-600">
                      Suspend
                    </Button>
                  )}
                  {user.status === 'suspended' && (
                    <Button size="sm" variant="outline" className="text-green-600">
                      Activate
                    </Button>
                  )}
                  {user.status === 'pending' && user.role === 'artisan' && (
                    <>
                      <Button size="sm" variant="craft">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>View Activity</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;