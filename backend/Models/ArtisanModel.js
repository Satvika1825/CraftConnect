const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  bio: String,
  craftType: String,
  location: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'  // Make sure this matches your product model name
  }],
  rating: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const artisanModel = mongoose.model('artisan', artisanSchema);
module.exports = artisanModel;
