const express = require('express');
const activityapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const ActivityModel = require('../Models/ActivityModel');
const cors = require('cors');

activityapp.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173','http://localhost:8081'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Get all activities
activityapp.get('/activities', expressAsyncHandler(async (req, res) => {
  try {
    const activities = await ActivityModel.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
}));

// Create activity logger middleware
const logActivity = async (type, userId, details, message) => {
  try {
    const activity = new ActivityModel({
      type,
      userId,
      details,
      message
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = { activityapp, logActivity };