const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artisan',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Central'],
    required: true
  },
  customerLocation: {
    state: String,
    city: String,
    pincode: String
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'],
  }
}, {
  timestamps: true
});

saleSchema.index({ artisanId: 1, saleDate: -1 });
saleSchema.index({ category: 1, saleDate: -1 });
saleSchema.index({ region: 1 });

module.exports = mongoose.model('Sale', saleSchema);