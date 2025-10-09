const express = require('express');
const mongoose = require('mongoose');
const orderapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const OrderModel = require('../Models/OrderModel');
const cors = require("cors");

orderapp.use(cors(
    { origin: 'http://localhost:8080', // allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PUT'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));

// Get orders for specific user
orderapp.get('/orders/user/:userId', expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const orders = await OrderModel.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
}));

orderapp.post('/orders/create', expressAsyncHandler(async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    const order = new OrderModel({
      userId,
      items: items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      })),
      total
    });

    const savedOrder = await order.save();
    await savedOrder.populate('items.productId');

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
}));

// Get all orders
orderapp.get('/orders', expressAsyncHandler(async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}));

// Update order status
orderapp.put('/orders/:orderId/status', expressAsyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId items.productId');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
}));

module.exports = orderapp;