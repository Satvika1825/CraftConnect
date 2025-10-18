import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@clerk/clerk-react';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artisanId: string;
  stock: number;
  approved: boolean;
}

interface EditFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: string;
}

export default function MyProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });
  const [saving, setSaving] = useState(false);

  const categories = ['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Metalwork', 'Painting', 'Other'];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      try {
        // First get the artisan ID using the user's Clerk ID
        const userResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`);
        if (userResponse.data) {
          const artisanResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/artisan-api/artisans`, {
            params: { userId: userResponse.data._id }
          });
          
          if (artisanResponse.data) {
            // Get products for this artisan
            const productsResponse = await axios.get(`https://craftconnect-bbdp.onrender.com/product-api/products`, {
              params: { artisanId: artisanResponse.data._id }
            });
            setProducts(productsResponse.data);
          }
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
    });
    setEditDialogOpen(true);
  };

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    // Validation
    if (!editFormData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!editFormData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!editFormData.price || parseFloat(editFormData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!editFormData.stock || parseInt(editFormData.stock) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }
    if (!editFormData.category) {
      toast.error('Category is required');
      return;
    }

    setSaving(true);
    try {
      // Include all original product fields to maintain data integrity
      const updatedData = {
        ...selectedProduct, // Keep all existing fields
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        price: parseFloat(editFormData.price),
        category: editFormData.category,
        image: editFormData.image.trim(),
        stock: parseInt(editFormData.stock)
      };

      // Remove _id from the payload as it shouldn't be in the update body
      const { _id, ...dataToSend } = updatedData;

      console.log('Sending update:', dataToSend);

      const response = await axios.put(
        `https://craftconnect-bbdp.onrender.com/product-api/products/${selectedProduct._id}`,
        dataToSend
      );

      console.log('Update response:', response.data);

      // Update the local state with the updated product
      setProducts(current =>
        current.map(p => p._id === selectedProduct._id ? { ...p, ...dataToSend } : p)
      );

      toast.success('Product updated successfully!');
      setEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Failed to update product. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`https://craftconnect-bbdp.onrender.com/product-api/products/${productId}`);
      setProducts(current => current.filter(p => p._id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
        <h1 className="text-4xl font-serif font-bold mb-8">My Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">You haven't added any products yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {product.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-xs text-muted-foreground mb-2">Category: {product.category}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-bold">₹{product.price}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => handleEditClick(product)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editFormData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={editFormData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={editFormData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={editFormData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="Enter image URL"
              />
              {editFormData.image && (
                <div className="mt-2">
                  <img 
                    src={editFormData.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}