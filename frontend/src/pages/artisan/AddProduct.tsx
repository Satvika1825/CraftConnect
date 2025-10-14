import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import axios from 'axios';
import {useLocation} from 'react-router-dom';

const categories = ['Pottery', 'Weaving', 'Embroidery', 'Woodwork', 'Jewelry', 'Painting'];

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addProduct } = useStore();
  const location=useLocation();
  const {artisanId}=location.state || {};
  console.log('Received artisanId:', artisanId);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
     if (!artisanId) {
      toast.error('Artisan ID is missing');
      return;
    }
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
      artisanId: artisanId,
      artisanName: user?.fullName || 'Unknown Artisan',
      approved: false,
    };

     try {
      const response = await axios.post('https://craftconnect-bbdp.onrender.com/product-api/products', {
        artisanId: artisanId,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        approved: false
      });
       if (response.data) {
        addProduct(product);
        toast.success('Product added! Waiting for admin approval.');
        navigate('/artisan/products');
      }
       } catch (error: any) {
      console.error('Error adding product to backend:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Add New Product</h1>

        <Card className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product"
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Add Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/artisan')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
