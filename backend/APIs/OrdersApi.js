const exp = require('express');
const orderapp = exp.Router();
const mongoose = require('mongoose');
const orderModel = require('../Models/OrderModel'); // your Order model
const cartModel = require('../Models/CartModel')   // needed for creating order

// ---------------- POST /orders → Create order from cart ----------------
orderapp.post('/order', async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await cartModel.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate totalAmount from cart items
        let totalAmount = 0;
        const items = cart.items.map(item => {
            if (!item.productId) {
                throw new Error('Product not found in database');
            }
            const price = item.productId.price; // now price exists
            totalAmount += price * item.quantity;
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price
            };
        });

        const newOrder = new orderModel({
            userId,
            items,
            totalAmount,
            shippingAddress: req.body.shippingAddress, // must provide all fields
            status: "pending"
        });

        await newOrder.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ---------------- GET /orders → Get all orders of logged-in user ----------------
orderapp.get('/orders', async (req, res) => {
    try {
        const userId = req.body.userId; // replace with auth middleware in real apps
        const orders = await orderModel.find({ userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------------- GET /orders/:id → Get specific order ----------------
orderapp.get('/order/:id', async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id).populate('items.productId', 'name price');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ---------------- PUT /orders/:id/status → Update order status ----------------
orderapp.put('/order/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // e.g., "Shipped", "Delivered"
        const order = await orderModel.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------------- DELETE /orders/:id → Cancel order ----------------
orderapp.delete('/order/:id', async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Only allow cancel if not shipped
        if (order.status === 'Shipped' || order.status === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel shipped/delivered order' });
        }

        await order.deleteOne();

        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = orderapp;
