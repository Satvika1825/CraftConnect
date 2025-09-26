const exp=require('express');
const cartapp=exp.Router();
const cartModel=require('../Models/CartModel');
// ---------------- POST /cart → Add item to cart ----------------
const mongoose = require('mongoose');
cartapp.post('/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (cart) {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        item => item.productId && item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity
        });
      }

      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      // Create new cart
      cart = new cartModel({
        userId: new mongoose.Types.ObjectId(userId),
        items: [{ productId: new mongoose.Types.ObjectId(productId), quantity }]
      });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ---------------- GET /cart → View current user’s cart ----------------
cartapp.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userId: req.params.userId })
                                    .populate('items.productId', 'name price'); // optional: populate product info
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// ---------------- PUT /cart/:itemId → Update quantity ----------------
cartapp.put('/cart/:userId/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartModel.findOne({ userId: req.params.userId });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);

        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        if (quantity <= 0) {
            // remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------------- DELETE /cart/:itemId → Remove from cart ----------------
cartapp.delete('/cart/:userId/:itemId', async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userId: req.params.userId });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports=cartapp;