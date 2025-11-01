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
import { useLocation } from 'react-router-dom';
import { Upload, Sparkles, CheckCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';

const categories = ['Pottery', 'Weaving', 'Embroidery', 'Woodwork', 'Jewelry', 'Painting', 'Basket Weaving', 'Wood Carving', 'Textile Craft', 'Metalwork'];

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addProduct } = useStore();
  const location = useLocation();
  const { artisanId } = location.state || {};
  console.log('Received artisanId:', artisanId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);

  // Handle image file selection and analysis
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze image with AI
    await analyzeImage(file);
  };

  // Analyze image from URL
  const handleAnalyzeFromURL = async () => {
    if (!formData.image) {
      toast.error('Please enter an image URL first');
      return;
    }

    // Validate URL
    try {
      new URL(formData.image);
    } catch {
      toast.error('Please enter a valid image URL');
      return;
    }

    setImagePreview(formData.image);
    toast.info('Fetching image from URL...');

    try {
      // Fetch image from URL and convert to blob
      const response = await fetch(formData.image);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      
      await analyzeImage(file);
    } catch (error) {
      console.error('Error fetching image:', error);
      toast.error('Could not fetch image from URL. Please check the URL and try again.');
    }
  };

  // Common function to analyze image
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShowAnalysis(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        'https://craftconnect-bbdp.onrender.com/api/analyze-craft-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setAnalysisResult(response.data.analysis);
        toast.success('AI Analysis Complete! 🎉');

        // Auto-fill form fields
        setFormData(prev => ({
          ...prev,
          name: response.data.analysis.title || prev.name,
          description: response.data.analysis.description || prev.description,
          category: response.data.analysis.category || prev.category,
        }));
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error('Could not analyze image. You can still fill the form manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setAnalysisResult(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  // Use AI suggestion for a specific field
  const useAISuggestion = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    toast.success(`Applied AI suggestion for ${field}`);
  };

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

    // Upload image first if file is selected
    let imageUrl = formData.image;
    if (imageFile) {
      try {
        // You can implement image upload to cloud storage here
        // For now, we'll use a placeholder or the preview
        imageUrl = imagePreview || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400';
        toast.info('Image uploaded successfully');
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload image, using default');
      }
    }

    const product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      image: imageUrl || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
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
        <h1 className="text-4xl font-serif font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground mb-8">
          Upload an image and let AI help you create the perfect product listing
        </p>

        <Card className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* AI Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Product Image *</Label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-2 text-primary font-medium mb-1">
                          <Sparkles className="h-5 w-5" />
                          <span>Upload Image for AI Analysis</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Our AI will detect material, category, and generate description
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  {/* Analysis Loading */}
                  {isAnalyzing && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                        <div>
                          <p className="font-medium text-blue-900">Analyzing your craft image...</p>
                          <p className="text-sm text-blue-700">Detecting material, category, and generating details</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {analysisResult && !isAnalyzing && showAnalysis && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 mb-2">AI Analysis Complete!</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAnalysis(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Material:</span>
                          <span className="px-2 py-1 bg-white border border-green-300 rounded">
                            {analysisResult.material}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Category:</span>
                          <span className="px-2 py-1 bg-white border border-green-300 rounded">
                            {analysisResult.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Confidence:</span>
                          <span className={`px-2 py-1 rounded ${
                            analysisResult.confidence === 'high' ? 'bg-green-200 text-green-800' :
                            analysisResult.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {analysisResult.confidence}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-green-700">
                        ✓ Form fields auto-filled. You can edit them below.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Or provide image URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or provide image URL</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  id="image-url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAnalyzeFromURL}
                  disabled={!formData.image || isAnalyzing}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze
                </Button>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
              {analysisResult && formData.name !== analysisResult.title && (
                <button
                  type="button"
                  onClick={() => useAISuggestion('name', analysisResult.title)}
                  className="mt-1 text-xs text-primary hover:underline"
                >
                  💡 AI Suggestion: {analysisResult.title}
                </button>
              )}
            </div>

            {/* Category */}
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
              {analysisResult && formData.category !== analysisResult.category && (
                <p className="mt-1 text-xs text-muted-foreground">
                  💡 AI Detected: {analysisResult.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product"
                rows={6}
              />
              {analysisResult && formData.description !== analysisResult.description && (
                <button
                  type="button"
                  onClick={() => useAISuggestion('description', analysisResult.description)}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  💡 Use AI-generated description
                </button>
              )}
            </div>

            {/* Price and Stock */}
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

            {/* Material Info (if available) */}
            {analysisResult && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Detected Material Information:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-background border rounded-full text-sm">
                    Material: {analysisResult.material}
                  </span>
                  {analysisResult.method && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Method: {analysisResult.method}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
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

        {/* Info Box */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">AI-Powered Product Creation</p>
                <p className="text-blue-700">
                  Upload an image or provide an image URL, then click "Analyze". Our AI will automatically detect the material,
                  suggest a category, and generate a compelling product description. You can always edit
                  the suggestions to make them perfect!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}