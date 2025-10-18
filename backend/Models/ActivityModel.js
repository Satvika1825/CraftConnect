const mongoose = require('mongoose');

// Clear any cached model to prevent enum validation issues
if (mongoose.models.Activity) {
  delete mongoose.models.Activity;
  delete mongoose.connection.models.Activity;
}

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

module.exports = mongoose.model('Activity', activitySchema);