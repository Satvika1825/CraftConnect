const express = require('express');
const userapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const UserModel = require('../Models/UserModel');
const cors = require("cors");

userapp.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173','https://craft-connect-blond.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//API
userapp.post('/user', expressAsyncHandler(async (req, res) => {
    const { clerkId, email, role, name } = req.body;

    if (!clerkId || !email || !role) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const userInDb = await UserModel.findOne({ clerkId });

    if (userInDb) {
        if (userInDb.role === role) {
            return res.status(200).send({ message: "User exists", user: userInDb });
        } else {
            return res.status(400).send({ message: "Clerk ID already registered with different role" });
        }
    }

    const newUser = new UserModel({ clerkId, email, role, name });
    const savedUser = await newUser.save();


    res.status(201).send({ message: "User created", user: savedUser });
}));

// ---------------- GET /users/:id → Get profile details ----------------
userapp.get('/user/:clerkId', expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findOne({clerkId: req.params.clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- PUT /users/:id → Update profile info ----------------
// Update user profile
userapp.put('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const oldUser = await UserModel.findById(req.params.id);
        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Log profile update activity
        await logActivity(
          'user_updated',
          updatedUser._id,
          {
            oldData: {
              name: oldUser.name,
              email: oldUser.email,
              role: oldUser.role
            },
            newData: {
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role
            }
          },
          `User profile updated: ${updatedUser.name}`
        );

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- DELETE /users/:id → Delete account ----------------
userapp.delete('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const deletedUser = await UserModel.findById(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await UserModel.findByIdAndDelete(req.params.id);

        // Log account deletion activity
        await logActivity(
          'user_deleted',
          deletedUser._id,
          {
            email: deletedUser.email,
            role: deletedUser.role
          },
          `User account deleted: ${deletedUser.name}`
        );

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Get all users
userapp.get('/users', expressAsyncHandler(async (req, res) => {
  try {
    const users = await UserModel.find()
      .select('-password -__v')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}));



module.exports=userapp;