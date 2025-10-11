const exp = require("express");
const adminapp = exp.Router();
const expressAsyncHandler = require("express-async-handler");

const userModel = require("../Models/UserModel");
const productModel = require("../Models/ProductModel");
const orderModel = require("../Models/OrderModel");
const ActivityModel = require("../Models/AdminModel");
const cors = require('cors');

// ---------------- ROOT ----------------
adminapp.get("/", (req, res) => {
  res.send({ message: "Admin API" });
});

adminapp.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}))
adminapp.get('/activities', expressAsyncHandler(async (req, res) => {
  try {
    const activities = await ActivityModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
}));

// ---------------- GET /admin/users → Manage all users ----------------
adminapp.get("/users", expressAsyncHandler(async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// ---------------- GET /admin/products → Manage all products ----------------
adminapp.get("/products", expressAsyncHandler(async (req, res) => {
  try {
    const products = await productModel.find().populate("artisanId", "name email");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// ---------------- GET /admin/orders → Manage all orders ----------------
adminapp.get("/orders", expressAsyncHandler(async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// ---------------- PUT /admin/users/:id/ban → Ban/unban a user ----------------
adminapp.put("/users/:id/ban", expressAsyncHandler(async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle ban status
    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({ message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// ---------------- PUT /admin/products/:id/approve → Approve/reject artisan products ----------------
adminapp.put("/products/:id/approve", expressAsyncHandler(async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const product = await productModel.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = status; // update approval status
    await product.save();

    res.status(200).json({ message: `Product ${status}`, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

module.exports = adminapp;
