const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artisan',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {  // Added image field
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;