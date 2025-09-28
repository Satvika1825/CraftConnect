import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, ImagePlus, Plus, X } from 'lucide-react';

const AddProduct: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(['Handmade', 'Traditional']);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-craft-terracotta">
          Add New Product
        </h1>
        <p className="text-muted-foreground">
          Share your beautiful handcrafted creation with the world
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input id="productName" placeholder="Enter product name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your product, its materials, crafting process, and unique features..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                      <SelectItem value="textiles">Textiles & Weaving</SelectItem>
                      <SelectItem value="woodwork">Wood Carving</SelectItem>
                      <SelectItem value="metalwork">Metalwork & Jewelry</SelectItem>
                      <SelectItem value="art">Traditional Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vases">Vases</SelectItem>
                      <SelectItem value="bowls">Bowls</SelectItem>
                      <SelectItem value="decorative">Decorative Items</SelectItem>
                      <SelectItem value="functional">Functional Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.1" placeholder="0.0" />
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Length" />
                  <Input placeholder="Width" />
                  <Input placeholder="Height" />
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label htmlFor="materials">Materials Used</Label>
                <Input id="materials" placeholder="e.g. Clay, Natural pigments, Terracotta" />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div 
                    key={index}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-craft-terracotta transition-colors"
                  >
                    {index === 0 ? (
                      <div className="text-center space-y-2">
                        <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Primary Image</div>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Additional</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload up to 4 high-quality images. First image will be the primary display image.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <Button size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processing">Processing Time (days)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 days</SelectItem>
                    <SelectItem value="3-5">3-5 days</SelectItem>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="custom">Custom Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping Cost (₹)</Label>
                <Input id="shipping" type="number" placeholder="0" />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" variant="craft" size="lg">
                Publish Product
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
              <Button variant="ghost" className="w-full">
                Preview Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;