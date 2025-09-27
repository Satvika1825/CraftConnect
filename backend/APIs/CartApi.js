const exp=require('express');
const cartapp=exp.Router();
const cartModel=require('../Models/CartModel');
const productModel=require('../Models/ProductModel');
const expressAsyncHandler = require("express-async-handler");
// ---------------- POST /cart → Add item to cart ----------------
cartapp.post(
  "/cart",
  expressAsyncHandler(async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // 1. Validate input
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // 2. Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3. Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 4. Check if user already has a cart
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new cartModel({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity; // increase quantity
      } else {
        cart.items.push({ productId, quantity }); // add new product
      }
    }

    // 5. Save cart
    await cart.save();

    res.status(201).json({ message: "Item added to cart", cart });
  })
);
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