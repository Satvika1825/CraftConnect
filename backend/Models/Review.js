// =============================================
// FILE: models/Review.js
// Review Model Schema
// =============================================

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // User who wrote the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Product being reviewed
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true
  },

  // Order from which this review originates
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required'],
    index: true
  },

  // Rating from 1 to 5
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },

  // Review text
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters long'],
    maxlength: [1000, 'Review must not exceed 1000 characters']
  },

  // Array of image URLs (max 5)
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(images) {
        return images.length <= 5;
      },
      message: 'Maximum 5 images allowed per review'
    }
  },

  // Number of users who found this review helpful
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },

  // Users who marked this as helpful (to prevent duplicate votes)
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Verification status
  verified: {
    type: Boolean,
    default: true // Set to true if order is verified
  },

  // Admin response (optional)
  adminResponse: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =============================================
// INDEXES
// =============================================

// Compound index to prevent duplicate reviews
reviewSchema.index(
  { userId: 1, productId: 1, orderId: 1 }, 
  { unique: true }
);

// Index for querying reviews by product
reviewSchema.index({ productId: 1, createdAt: -1 });

// Index for querying reviews by user
reviewSchema.index({ userId: 1, createdAt: -1 });

// Index for querying verified reviews
reviewSchema.index({ productId: 1, verified: 1 });

// Text index for searching review content
reviewSchema.index({ review: 'text' });

// =============================================
// VIRTUAL PROPERTIES
// =============================================

// Virtual for review age
reviewSchema.virtual('reviewAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for has images
reviewSchema.virtual('hasImages').get(function() {
  return this.images && this.images.length > 0;
});

// Virtual for image count
reviewSchema.virtual('imageCount').get(function() {
  return this.images ? this.images.length : 0;
});

// =============================================
// INSTANCE METHODS
// =============================================

// Check if user has already marked as helpful
reviewSchema.methods.hasUserMarkedHelpful = function(userId) {
  return this.helpfulBy.some(id => id.toString() === userId.toString());
};

// Mark as helpful by user
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.hasUserMarkedHelpful(userId)) {
    this.helpfulBy.push(userId);
    this.helpful = this.helpfulBy.length;
    await this.save();
    return true;
  }
  return false;
};

// Unmark as helpful by user
reviewSchema.methods.unmarkHelpful = async function(userId) {
  const index = this.helpfulBy.findIndex(id => id.toString() === userId.toString());
  if (index !== -1) {
    this.helpfulBy.splice(index, 1);
    this.helpful = this.helpfulBy.length;
    await this.save();
    return true;
  }
  return false;
};

// =============================================
// STATIC METHODS
// =============================================

// Get average rating for a product
reviewSchema.statics.getProductRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

// Get rating distribution for a product
reviewSchema.statics.getRatingDistribution = async function(productId) {
  const result = await this.aggregate([
    { $match: { productId: mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result.forEach(item => {
    distribution[item._id] = item.count;
  });

  return distribution;
};

// Check if user can review a product
reviewSchema.statics.canUserReview = async function(userId, productId, orderId) {
  // Check if review already exists
  const existingReview = await this.findOne({ userId, productId, orderId });
  if (existingReview) {
    return { canReview: false, reason: 'Already reviewed' };
  }

  // Check order status
  const Order = mongoose.model('Order');
  const order = await Order.findById(orderId);
  
  if (!order) {
    return { canReview: false, reason: 'Order not found' };
  }

  if (order.userId.toString() !== userId.toString()) {
    return { canReview: false, reason: 'Not your order' };
  }

  if (order.status !== 'delivered') {
    return { canReview: false, reason: 'Order not delivered' };
  }

  // Check if product is in order
  const productInOrder = order.items.some(
    item => item.productId.toString() === productId.toString()
  );

  if (!productInOrder) {
    return { canReview: false, reason: 'Product not in order' };
  }

  return { canReview: true };
};

// Get top reviews for a product
reviewSchema.statics.getTopReviews = async function(productId, limit = 5) {
  return await this.find({ productId })
    .populate('userId', 'name profileImage')
    .sort('-helpful -rating -createdAt')
    .limit(limit);
};

// Get recent reviews for a product
reviewSchema.statics.getRecentReviews = async function(productId, limit = 10) {
  return await this.find({ productId })
    .populate('userId', 'name profileImage')
    .sort('-createdAt')
    .limit(limit);
};

// Search reviews
reviewSchema.statics.searchReviews = async function(productId, searchTerm) {
  return await this.find({
    productId,
    $text: { $search: searchTerm }
  })
    .populate('userId', 'name profileImage')
    .sort({ score: { $meta: 'textScore' } });
};

// =============================================
// MIDDLEWARE
// =============================================

// Pre-save middleware to update updatedAt
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Post-save middleware to update product rating
reviewSchema.post('save', async function(doc) {
  try {
    const Product = mongoose.model('Product');
    const ratingData = await this.constructor.getProductRating(doc.productId);
    
    await Product.findByIdAndUpdate(doc.productId, {
      averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
      totalReviews: ratingData.totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating after save:', error);
  }
});

// Post-remove middleware to update product rating
reviewSchema.post('remove', async function(doc) {
  try {
    const Product = mongoose.model('Product');
    const ratingData = await this.constructor.getProductRating(doc.productId);
    
    await Product.findByIdAndUpdate(doc.productId, {
      averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
      totalReviews: ratingData.totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating after remove:', error);
  }
});

// Post-findOneAndDelete middleware
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const Product = mongoose.model('Product');
      const ratingData = await doc.constructor.getProductRating(doc.productId);
      
      await Product.findByIdAndUpdate(doc.productId, {
        averageRating: parseFloat(ratingData.averageRating.toFixed(1)),
        totalReviews: ratingData.totalReviews
      });
    } catch (error) {
      console.error('Error updating product rating after delete:', error);
    }
  }
});

// =============================================
// EXPORT MODEL
// =============================================

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;