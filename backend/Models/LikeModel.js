const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: [true, 'Product ID is required']
  }
}, { 
  timestamps: true 
});

// Create compound index to prevent duplicate likes
likeSchema.index({ userId: 1, productId: 1 }, { unique: true });

const LikeModel = mongoose.model('Like', likeSchema);
module.exports = LikeModel;