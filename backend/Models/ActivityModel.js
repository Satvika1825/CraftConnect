const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'product_added',
      'product_updated', 
      'product_deleted',
      'product_approved',
      'order_placed',
      'order_status_updated',
      'user_registered',
      'artisan_registered',
      'review_added'
    ],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);