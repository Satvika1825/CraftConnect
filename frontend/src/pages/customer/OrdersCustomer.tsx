import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Star, 
  Upload, 
  X 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

interface ReviewImage {
  file: File;
  preview: string;
}

export default function OrdersCustomer() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Dialog States
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: OrderItem['productId'];
    orderId: string;
    quantity: number;
    price: number;
  } | null>(null);
  
  // Review Form States
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Get user's MongoDB ID first
      const userResponse = await axios.get(
        `https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`
      );
      if (!userResponse.data?._id) return;

      // Fetch user's orders
      const ordersResponse = await axios.get(
        `https://craftconnect-bbdp.onrender.com/order-api/orders/user/${userResponse.data._id}`
      );
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  // Open Review Dialog
  const openReviewDialog = (item: OrderItem, orderId: string) => {
    setSelectedProduct({
      productId: item.productId,
      orderId,
      quantity: item.quantity,
      price: item.price
    });
    setReviewDialogOpen(true);
    
    // Reset form
    setRating(0);
    setReviewText('');
    setReviewImages([]);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 5;
    
    if (reviewImages.length + files.length > maxImages) {
      toast.error(`You can upload maximum ${maxImages} images`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        toast.error(`${file.name} is not a valid image format`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages(prev => [...prev, {
          file,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove Image
  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Review
  const submitReview = async () => {
    if (!user || !selectedProduct) return;

    // Validation
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim() || reviewText.trim().length < 10) {
      toast.error('Please write a review (minimum 10 characters)');
      return;
    }

    if (reviewText.length > 1000) {
      toast.error('Review must not exceed 1000 characters');
      return;
    }

    setSubmittingReview(true);

    try {
      // Get user's MongoDB ID
      const userResponse = await axios.get(
        `https://craftconnect-bbdp.onrender.com/user-api/user/${user.id}`
      );
      
      if (!userResponse.data || !userResponse.data._id) {
        toast.error('User not found');
        return;
      }

      const userId = userResponse.data._id;

      // Prepare review data - matching backend expected format
      const reviewData = {
        userId,
        productId: selectedProduct.productId._id,
        orderId: selectedProduct.orderId,
        rating,
        review: reviewText.trim(),
        images: reviewImages.length > 0 ? reviewImages.map(img => img.preview) : []
      };

      console.log('Submitting review data:', reviewData);

      // Submit review to backend
      const response = await axios.post(
        'https://craftconnect-bbdp.onrender.com/review-api/reviews',
        reviewData
      );

      console.log('Review response:', response.data);

      toast.success('Review submitted successfully! Thank you for your feedback.');
      setReviewDialogOpen(false);
      
      // Reset form
      setRating(0);
      setReviewText('');
      setReviewImages([]);
      
      // Optionally refresh orders to show review was submitted
      fetchOrders();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid review data. Please check all fields.');
      } else if (error.response?.status === 404) {
        toast.error('Product or order not found. Please try again.');
      } else if (error.response?.status === 409) {
        toast.error('You have already reviewed this product.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit review. Please try again later.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">No orders found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start shopping to see your orders here!
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col gap-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="text-sm font-mono">{order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="font-bold text-xl text-primary">₹{order.total}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item) => (
                      <div 
                        key={item.productId._id} 
                        className="flex flex-col gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-semibold line-clamp-2">
                              {item.productId.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-bold mt-2 text-primary">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                        
                        {/* Review Button for Delivered Items */}
                        {order.status === 'delivered' && (
                          <Button
                            onClick={() => openReviewDialog(item, order._id)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Write Review
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Order Status */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{order.status}</p>
                      </div>
                    </div>
                    
                    {order.status === 'delivered' && (
                      <div className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Delivered Successfully
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Write a Review</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <img
                  src={selectedProduct.productId.image}
                  alt={selectedProduct.productId.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold">{selectedProduct.productId.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{selectedProduct.price} • Qty: {selectedProduct.quantity}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-3 text-sm font-medium text-muted-foreground">
                      {getRatingText(rating)}
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product... (minimum 10 characters)"
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {reviewText.length}/1000 characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Photos (Optional - Max 5)
                </label>
                <div className="space-y-4">
                  {reviewImages.length < 5 && (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload images
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB each
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Image Previews */}
                  {reviewImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {reviewImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview}
                            alt={`Review ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setReviewDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  disabled={submittingReview || rating === 0 || !reviewText.trim() || reviewText.trim().length < 10}
                  className="flex-1"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}