const express = require('express');
const adminapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const cors = require("cors");
const mongoose = require('mongoose');

adminapp.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173','https://craft-connect-blond.vercel.app','http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// ==================== MODELS ====================

// Announcement Model
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'promotion'],
    default: 'info'
  },
  active: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Check if model already exists to avoid OverwriteModelError
const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

// Activity Model
const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'user_registered', 
      'product_added', 
      'product_approved', 
      'product_rejected',
      'order_placed', 
      'artisan_approved', 
      'artisan_rejected',
      'role_changed', 
      'user_updated', 
      'user_deleted'
    ],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const ActivityModel = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

// ==================== HELPER FUNCTION ====================

// Helper function to log activity
const logActivity = async (type, userId, details, message) => {
  try {
    const activity = new ActivityModel({
      type,
      userId,
      message,
      details
    });
    await activity.save();
    console.log('Activity logged:', message);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// ==================== ANNOUNCEMENTS ROUTES ====================

// GET /admin-api/announcements - Get all announcements
adminapp.get('/announcements', expressAsyncHandler(async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find()
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
}));

// GET /admin-api/announcements/active - Get only active announcements
adminapp.get('/announcements/active', expressAsyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const announcements = await AnnouncementModel.find({
      active: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    res.status(500).json({ message: 'Failed to fetch active announcements' });
  }
}));

// POST /admin-api/announcements - Create new announcement
adminapp.post('/announcements', expressAsyncHandler(async (req, res) => {
  try {
    const { title, message, type, active, startDate, endDate } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const announcement = new AnnouncementModel({
      title,
      message,
      type: type || 'info',
      active: active !== undefined ? active : true,
      startDate: startDate || new Date(),
      endDate: endDate || null
    });

    const savedAnnouncement = await announcement.save();
    
    await logActivity(
      'product_approved', // Using existing type
      null,
      { announcementId: savedAnnouncement._id },
      `New announcement created: ${title}`
    );

    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
}));

// PUT /admin-api/announcements/:id - Update announcement
adminapp.put('/announcements/:id', expressAsyncHandler(async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Failed to update announcement' });
  }
}));

// PATCH /admin-api/announcements/:id - Toggle active status or partial update
adminapp.patch('/announcements/:id', expressAsyncHandler(async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Failed to update announcement' });
  }
}));

// DELETE /admin-api/announcements/:id - Delete announcement
adminapp.delete('/announcements/:id', expressAsyncHandler(async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await AnnouncementModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
}));

// ==================== ACTIVITIES ROUTES ====================

// GET /admin-api/activities - Get recent activities
adminapp.get('/activities', expressAsyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = await ActivityModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email role');
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
}));

// POST /admin-api/activities - Log new activity
adminapp.post('/activities', expressAsyncHandler(async (req, res) => {
  try {
    const { type, userId, message, details } = req.body;

    if (!type || !message) {
      return res.status(400).json({ message: 'Type and message are required' });
    }

    const activity = new ActivityModel({
      type,
      userId: userId || null,
      message,
      details: details || {}
    });

    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Failed to log activity' });
  }
}));

// DELETE /admin-api/activities - Clear old activities (optional cleanup)
adminapp.delete('/activities/cleanup', expressAsyncHandler(async (req, res) => {
  try {
    const daysToKeep = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await ActivityModel.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.json({ 
      message: `Deleted ${result.deletedCount} old activities`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error cleaning up activities:', error);
    res.status(500).json({ message: 'Failed to cleanup activities' });
  }
}));

// ==================== DASHBOARD STATS ====================

// GET /admin-api/stats - Get dashboard statistics
adminapp.get('/stats', expressAsyncHandler(async (req, res) => {
  try {
    const UserModel = mongoose.model('user');
    const ProductModel = mongoose.model('product');
    const OrderModel = mongoose.model('Order');

    const [users, products, orders] = await Promise.all([
      UserModel.find(),
      ProductModel.find(),
      OrderModel.find()
    ]);

    const stats = {
      totalUsers: users.length,
      totalArtisans: users.filter(u => u.role === 'artisan').length,
      totalCustomers: users.filter(u => u.role === 'customer').length,
      pendingArtisans: users.filter(u => u.role === 'artisan' && !u.approved).length,
      totalProducts: products.length,
      pendingProducts: products.filter(p => !p.approved).length,
      approvedProducts: products.filter(p => p.approved).length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
}));

// Export the router and helper function
module.exports = adminapp;
module.exports.logActivity = logActivity;