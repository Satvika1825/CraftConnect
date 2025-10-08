const express = require('express');
const mongoose = require('mongoose');
const likeapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const LikeModel = require('../Models/LikeModel');
const cors = require("cors");

likeapp.use(cors(
    { origin: 'http://localhost:8080', // allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PUT'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));
// Toggle like status
likeapp.post('/likes/toggle', expressAsyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existingLike = await LikeModel.findOne({ userId, productId });

    if (existingLike) {
      await LikeModel.deleteOne({ _id: existingLike._id });
      res.json({ liked: false });
    } else {
      const newLike = new LikeModel({ userId, productId });
      await newLike.save();
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like status' });
  }
}));

// Get liked products for user
likeapp.get('/likes/:userId', expressAsyncHandler(async (req, res) => {
  try {
    const likes = await LikeModel.find({ userId: req.params.userId })
      .populate('productId');
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch liked items' });
  }
}));

module.exports = likeapp;