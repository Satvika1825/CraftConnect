const mongoose = require('mongoose');

// Activity Schema
const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user_registered', 'product_added', 'product_approved', 'order_placed'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ActivityModel = mongoose.model('Activity', activitySchema);
module.exports = ActivityModel;