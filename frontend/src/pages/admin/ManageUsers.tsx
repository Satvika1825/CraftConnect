import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { UserCircle, Mail, Calendar, Check, X, Search, Shield, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  role: 'admin' | 'artisan' | 'customer';
  approved?: boolean;
  createdAt: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://craftconnect-bbdp.onrender.com/user-api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproveArtisan = async (userId: string) => {
    try {
      await axios.patch(`https://craftconnect-bbdp.onrender.com/user-api/users/${userId}`, {
        approved: true
      });

      setUsers(currentUsers =>
        currentUsers.map(user =>
          user._id === userId ? { ...user, approved: true } : user
        )
      );

      toast.success('Artisan approved successfully!');
    } catch (error: any) {
      console.error('Error approving artisan:', error);
      toast.error(error.response?.data?.message || 'Failed to approve artisan');
    }
  };

  const handleRejectArtisan = async (userId: string) => {
    try {
      await axios.delete(`https://craftconnect-bbdp.onrender.com/user-api/users/${userId}`);

      setUsers(currentUsers => currentUsers.filter(user => user._id !== userId));

      toast.success('Artisan application rejected');
    } catch (error: any) {
      console.error('Error rejecting artisan:', error);
      toast.error(error.response?.data?.message || 'Failed to reject artisan');
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`https://craftconnect-bbdp.onrender.com/user-api/users/${userId}`, {
        role: newRole
      });

      setUsers(currentUsers =>
        currentUsers.map(user =>
          user._id === userId ? { ...user, role: newRole as User['role'] } : user
        )
      );

      toast.success('User role updated successfully!');
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`https://craftconnect-bbdp.onrender.com/user-api/users/${selectedUser._id}`);

      setUsers(currentUsers => currentUsers.filter(user => user._id !== selectedUser._id));
      setShowDeleteDialog(false);
      setSelectedUser(null);

      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'artisan': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'customer': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const pendingArtisans = users.filter(u => u.role === 'artisan' && !u.approved);
  const approvedArtisans = users.filter(u => u.role === 'artisan' && u.approved);
  const customers = users.filter(u => u.role === 'customer');
  const admins = users.filter(u => u.role === 'admin');

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
        <h1 className="text-4xl font-serif font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground mb-8">
          Approve artisans, manage user roles, and monitor platform users
        </p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              {/*<Users className="h-8 w-8 text-primary" />}*/}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Artisans</p>
                <p className="text-2xl font-bold">{approvedArtisans.length}</p>
              </div>
              <UserCircle className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <UserCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingArtisans.length}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users ({users.length})</SelectItem>
              <SelectItem value="admin">Admins ({admins.length})</SelectItem>
              <SelectItem value="artisan">Artisans ({approvedArtisans.length})</SelectItem>
              <SelectItem value="customer">Customers ({customers.length})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pending Artisan Approvals */}
        {pendingArtisans.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-yellow-600" />
              Pending Artisan Approvals ({pendingArtisans.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingArtisans.map((user) => (
                <Card key={user._id} className="p-6 border-l-4 border-l-yellow-500">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <UserCircle className="h-10 w-10 text-yellow-600" />
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="text-xs">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        onClick={() => handleApproveArtisan(user._id)}
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectArtisan(user._id)}
                        variant="destructive"
                        size="sm"
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Users List */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            All Users ({filteredUsers.length})
          </h2>
          {filteredUsers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No users found</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <UserCircle className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                    {user.role === 'artisan' && user.approved && (
                      <Badge className="w-fit bg-green-100 text-green-800">
                        ✓ Approved Artisan
                      </Badge>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleChangeRole(user._id, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="artisan">Artisan</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}