import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Bell, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  active: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Announcement['type'],
    active: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('https://craftconnect-bbdp.onrender.com/admin-api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingAnnouncement) {
        // Update existing
        await axios.put(`https://craftconnect-bbdp.onrender.com/admin-api/announcements/${editingAnnouncement._id}`, formData);
        
        setAnnouncements(current =>
          current.map(a => a._id === editingAnnouncement._id ? { ...a, ...formData } : a)
        );
        
        toast.success('Announcement updated successfully!');
      } else {
        // Create new
        const response = await axios.post('https://craftconnect-bbdp.onrender.com/admin-api/announcements', formData);
        setAnnouncements(current => [response.data, ...current]);
        toast.success('Announcement created successfully!');
      }

      resetForm();
      setShowDialog(false);
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(`https://craftconnect-bbdp.onrender.com/admin-api/announcements/${id}`);
      setAnnouncements(current => current.filter(a => a._id !== id));
      toast.success('Announcement deleted');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      await axios.patch(`https://craftconnect-bbdp.onrender.com/admin-api/announcements/${announcement._id}`, {
        active: !announcement.active
      });

      setAnnouncements(current =>
        current.map(a => a._id === announcement._id ? { ...a, active: !a.active } : a)
      );

      toast.success(announcement.active ? 'Announcement hidden' : 'Announcement activated');
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      active: announcement.active,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : ''
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      active: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setEditingAnnouncement(null);
  };

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'promotion': return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const activeAnnouncements = announcements.filter(a => a.active);
  const inactiveAnnouncements = announcements.filter(a => !a.active);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Manage Announcements</h1>
            <p className="text-muted-foreground">Create and manage platform-wide announcements</p>
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Announcement
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeAnnouncements.length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveAnnouncements.length}</p>
              </div>
              <EyeOff className="h-8 w-8 text-gray-600" />
            </div>
          </Card>
        </div>

        {/* Active Announcements */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Active Announcements</h2>
          {activeAnnouncements.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No active announcements</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAnnouncements.map((announcement) => (
                <Card key={announcement._id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{announcement.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{announcement.message}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Start: {new Date(announcement.startDate).toLocaleDateString()}</span>
                        {announcement.endDate && (
                          <span>End: {new Date(announcement.endDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleToggleActive(announcement)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(announcement._id)}
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

        {/* Inactive Announcements */}
        {inactiveAnnouncements.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Inactive Announcements</h2>
            <div className="space-y-4">
              {inactiveAnnouncements.map((announcement) => (
                <Card key={announcement._id} className="p-6 opacity-60">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{announcement.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{announcement.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleToggleActive(announcement)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(announcement._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter announcement message"
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 pt-7">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="active" className="cursor-pointer">Active</Label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAnnouncement ? 'Update' : 'Create'} Announcement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}