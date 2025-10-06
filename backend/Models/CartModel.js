const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
}, { 
  timestamps: true 
});

// Create compound index for userId and productId
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartModel = mongoose.model('CartItem', cartItemSchema);
module.exports = CartModel;