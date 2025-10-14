const express = require('express');
const mongoose = require('mongoose');
const cartapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const CartModel = require('../Models/CartModel');
const cors = require("cors");

cartapp.use(cors(
    { origin: ['http://localhost:8080','https://craft-connect-blond.vercel.app'], // allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PUT'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));
// Add item to cart
cartapp.post('/cart/add', expressAsyncHandler(async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ 
        message: 'Invalid userId or productId format',
        received: { userId, productId }
      });
    }

    let cartItem = await CartModel.findOne({ 
      userId: userId,
      productId: productId 
    });

    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      cartItem = new CartModel({
        userId,
        productId,
        quantity: parseInt(quantity)
      });
      await cartItem.save();

    }

    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
}));

// Get user's cart
cartapp.get('/cart/:userId', expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format' 
      });
    }

    const cartItems = await CartModel.find({ userId })
      .populate({
        path: 'productId',
        select: 'name description price category image'
      });

   
    res.json(cartItems);

  } catch (error) {
   
    res.status(500).json({ 
      message: 'Failed to fetch cart items',
      error: error.message 
    });
  }
}));

// ---------------- PUT /cart/:itemId → Update quantity ----------------
cartapp.put('/cart/:itemId', expressAsyncHandler(async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }

    const updatedItem = await CartModel.findByIdAndUpdate(
      req.params.itemId,
      { quantity: parseInt(quantity) },
      { new: true }
    ).populate('productId');

    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item' });
  }
}));

// ---------------- DELETE /cart/:itemId → Remove from cart ----------------
cartapp.delete('/cart/:itemId', expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }

    const deletedItem = await CartModel.findByIdAndDelete(req.params.itemId);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
}));

module.exports = cartapp;