// =============================================
// FILE: routes/reviewRoutes.js
// Complete Review API Routes
// =============================================

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// =============================================
// HELPER FUNCTION: Update Product Rating
// =============================================

async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ productId });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0
      });
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length
    });

    return { 
      averageRating: parseFloat(averageRating), 
      totalReviews: reviews.length 
    };
  } catch (error) {
    console.error('Error updating product rating:', error);
    throw error;
  }
}

// =============================================
// POST /review-api/reviews - Create a new review
// =============================================

router.post('/reviews', async (req, res) => {
  try {
    const { userId, productId, orderId, rating, review, images } = req.body;

    // Validation
    if (!userId || !productId || !orderId || !rating || !review) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['userId', 'productId', 'orderId', 'rating', 'review']
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Validate review text length
    if (review.trim().length < 10) {
      return res.status(400).json({ 
        message: 'Review must be at least 10 characters long' 
      });
    }

    if (review.length > 1000) {
      return res.status(400).json({ 
        message: 'Review must not exceed 1000 characters' 
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ 
        message: 'You can only review products from delivered orders',
        currentStatus: order.status
      });
    }

    // Verify the order belongs to the user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only review products from your own orders' 
      });
    }

    // Verify the product is in the order
    const productInOrder = order.items.some(
      item => item.productId.toString() === productId
    );

    if (!productInOrder) {
      return res.status(400).json({ 
        message: 'This product was not in the specified order' 
      });
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await Review.findOne({
      userId,
      productId,
      orderId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product for this order',
        reviewId: existingReview._id
      });
    }

    // Validate images array
    let validatedImages = [];
    if (images && Array.isArray(images)) {
      if (images.length > 5) {
        return res.status(400).json({ 
          message: 'Maximum 5 images allowed per review' 
        });
      }
      validatedImages = images.filter(img => typeof img === 'string' && img.trim() !== '');
    }

    // Create new review
    const newReview = new Review({
      userId,
      productId,
      orderId,
      rating: parseInt(rating),
      review: review.trim(),
      images: validatedImages,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newReview.save();

    // Update product's average rating
    const ratingStats = await updateProductRating(productId);

    // Populate user details for response
    await newReview.populate('userId', 'name profileImage');
    await newReview.populate('productId', 'name image');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview,
      productRating: ratingStats
    });

  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    res.status(500).json({ 
      message: 'Server error while creating review', 
      error: error.message 
    });
  }
});

// =============================================
// GET /review-api/reviews/product/:productId - Get reviews for a product
// =============================================

router.get('/reviews/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      limit = 10, 
      page = 1, 
      sort = '-createdAt',
      minRating,
      maxRating
    } = req.query;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build query
    let query = { productId };

    // Filter by rating if specified
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseInt(minRating);
      if (maxRating) query.rating.$lte = parseInt(maxRating);
    }

    // Parse pagination
    const limitNum = Math.min(parseInt(limit), 50); // Max 50 per page
    const pageNum = Math.max(parseInt(page), 1);
    const skip = (pageNum - 1) * limitNum;

    // Fetch reviews
    const reviews = await Review.find(query)
      .populate('userId', 'name profileImage email')
      .populate('productId', 'name image price')
      .sort(sort)
      .limit(limitNum)
      .skip(skip)
      .lean();

    // Get total count
    const total = await Review.countDocuments(query);

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Format distribution
    const distribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasMore: skip + reviews.length < total
      },
      statistics: {
        averageRating: product.averageRating || 0,
        totalReviews: product.totalReviews || 0,
        distribution
      }
    });

  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ 
      message: 'Server error while fetching reviews', 
      error: error.message 
    });
  }
});

// =============================================
// GET /review-api/reviews/user/:userId - Get reviews by user
// =============================================

router.get('/reviews/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse pagination
    const limitNum = Math.min(parseInt(limit), 50);
    const pageNum = Math.max(parseInt(page), 1);
    const skip = (pageNum - 1) * limitNum;

    // Fetch user's reviews
    const reviews = await Review.find({ userId })
      .populate('productId', 'name image price category')
      .populate('orderId', 'createdAt total')
      .sort('-createdAt')
      .limit(limitNum)
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ userId });

    // Calculate user's review statistics
    const stats = await Review.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalHelpful: { $sum: '$helpful' }
        }
      }
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      statistics: stats.length > 0 ? stats[0] : {
        totalReviews: 0,
        averageRating: 0,
        totalHelpful: 0
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      message: 'Server error while fetching user reviews', 
      error: error.message 
    });
  }
});

// =============================================
// GET /review-api/reviews/:reviewId - Get single review
// =============================================

router.get('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate('userId', 'name profileImage email')
      .populate('productId', 'name image price')
      .populate('orderId', 'createdAt total status')
      .lean();

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      message: 'Server error while fetching review', 
      error: error.message 
    });
  }
});

// =============================================
// PUT /review-api/reviews/:reviewId - Update review
// =============================================

router.put('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, rating, review, images } = req.body;

    // Find existing review
    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Verify ownership
    if (!userId || existingReview.userId.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only edit your own reviews' 
      });
    }

    // Validate rating if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          message: 'Rating must be between 1 and 5' 
        });
      }
      existingReview.rating = parseInt(rating);
    }

    // Validate review text if provided
    if (review !== undefined) {
      if (review.trim().length < 10) {
        return res.status(400).json({ 
          message: 'Review must be at least 10 characters long' 
        });
      }
      if (review.length > 1000) {
        return res.status(400).json({ 
          message: 'Review must not exceed 1000 characters' 
        });
      }
      existingReview.review = review.trim();
    }

    // Validate images if provided
    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({ message: 'Images must be an array' });
      }
      if (images.length > 5) {
        return res.status(400).json({ 
          message: 'Maximum 5 images allowed per review' 
        });
      }
      existingReview.images = images.filter(img => 
        typeof img === 'string' && img.trim() !== ''
      );
    }

    existingReview.updatedAt = new Date();

    await existingReview.save();

    // Update product rating if rating changed
    if (rating !== undefined) {
      await updateProductRating(existingReview.productId);
    }

    // Populate for response
    await existingReview.populate('userId', 'name profileImage');
    await existingReview.populate('productId', 'name image');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: existingReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    res.status(500).json({ 
      message: 'Server error while updating review', 
      error: error.message 
    });
  }
});

// =============================================
// DELETE /review-api/reviews/:reviewId - Delete review
// =============================================

router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    // Find review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Verify ownership (or admin)
    if (!userId || review.userId.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only delete your own reviews' 
      });
    }

    const productId = review.productId;

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    // Update product rating
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Server error while deleting review', 
      error: error.message 
    });
  }
});

// =============================================
// POST /review-api/reviews/:reviewId/helpful - Mark review as helpful
// =============================================

router.post('/reviews/:reviewId/helpful', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Find review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Increment helpful count
    review.helpful = (review.helpful || 0) + 1;
    await review.save();

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      helpfulCount: review.helpful
    });

  } catch (error) {
    console.error('Error updating helpful count:', error);
    res.status(500).json({ 
      message: 'Server error while updating helpful count', 
      error: error.message 
    });
  }
});

// =============================================
// GET /review-api/reviews/stats/product/:productId - Get detailed review statistics
// =============================================

router.get('/reviews/stats/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get detailed statistics
    const stats = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId) } },
      {
        $facet: {
          ratingDistribution: [
            {
              $group: {
                _id: '$rating',
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: -1 } }
          ],
          overallStats: [
            {
              $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' },
                totalImages: { $sum: { $size: '$images' } },
                totalHelpful: { $sum: '$helpful' }
              }
            }
          ],
          recentReviews: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                rating: 1,
                review: { $substr: ['$review', 0, 100] },
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      statistics: stats[0]
    });

  } catch (error) {
    console.error('Error fetching review statistics:', error);
    res.status(500).json({ 
      message: 'Server error while fetching statistics', 
      error: error.message 
    });
  }
});

// =============================================
// GET /review-api/reviews/check/:userId/:productId/:orderId - Check if user can review
// =============================================

router.get('/reviews/check/:userId/:productId/:orderId', async (req, res) => {
  try {
    const { userId, productId, orderId } = req.params;

    // Check if review already exists
    const existingReview = await Review.findOne({
      userId,
      productId,
      orderId
    });

    if (existingReview) {
      return res.json({
        canReview: false,
        reason: 'Already reviewed',
        existingReview: existingReview._id
      });
    }

    // Check order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({
        canReview: false,
        reason: 'Order not found'
      });
    }

    if (order.status !== 'delivered') {
      return res.json({
        canReview: false,
        reason: 'Order not delivered yet',
        currentStatus: order.status
      });
    }

    // Check if product is in order
    const productInOrder = order.items.some(
      item => item.productId.toString() === productId
    );

    if (!productInOrder) {
      return res.json({
        canReview: false,
        reason: 'Product not in order'
      });
    }

    res.json({
      canReview: true,
      message: 'You can review this product'
    });

  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;