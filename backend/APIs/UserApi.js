const express = require('express');
const userapp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const UserModel = require('../Models/UserModel');
const cors = require("cors");

// Helper function for activity logging (optional)
const logActivity = async (type, userId, details, message) => {
  try {
    // You can implement activity logging here if you have an Activity model
    console.log('Activity:', { type, userId, details, message });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// ---------------- POST /user → Create new user ----------------
userapp.post('/user', expressAsyncHandler(async (req, res) => {
    const { clerkId, email, role, name } = req.body;

    if (!clerkId || !email || !role) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const userInDb = await UserModel.findOne({ clerkId });

    if (userInDb) {
        // User exists - update name if it's different (in case they changed it in Google)
        if (userInDb.name !== name && name) {
            userInDb.name = name;
            await userInDb.save();
        }
        
        if (userInDb.role === role) {
            return res.status(200).send({ message: "User exists", user: userInDb });
        } else {
            return res.status(400).send({ message: "Clerk ID already registered with different role" });
        }
    }

    // Create new user with name from Google/Clerk
    const newUser = new UserModel({ 
      clerkId, 
      email, 
      role, 
      name: name || email.split('@')[0], // Use name from Google, fallback to email username
      approved: role === 'artisan' ? false : true // Artisans need approval
    });
    const savedUser = await newUser.save();

    await logActivity(
      'user_registered',
      savedUser._id,
      { role: savedUser.role },
      `New ${role} registered: ${name || email}`
    );

    res.status(201).send({ message: "User created", user: savedUser });
}));

// ---------------- GET /user/:clerkId → Get user by Clerk ID ----------------
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

// ---------------- GET /users → Get all users ----------------
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

// ---------------- PATCH /users/:id → Update specific fields (Approve artisan, change role) ----------------
userapp.patch('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const oldUser = await UserModel.findById(req.params.id);
        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the fields provided in req.body
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        // Log the update
        if (req.body.approved !== undefined) {
          await logActivity(
            'artisan_approved',
            updatedUser._id,
            { approved: req.body.approved },
            `Artisan ${req.body.approved ? 'approved' : 'rejected'}: ${updatedUser.name}`
          );
        }

        if (req.body.role !== undefined && req.body.role !== oldUser.role) {
          await logActivity(
            'role_changed',
            updatedUser._id,
            { oldRole: oldUser.role, newRole: req.body.role },
            `User role changed from ${oldUser.role} to ${req.body.role}: ${updatedUser.name}`
          );
        }

        res.status(200).json({ 
          message: "User updated successfully", 
          user: updatedUser 
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- PUT /users/:id → Update full profile info ----------------
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

// ---------------- DELETE /users/:id → Delete user account ----------------
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

module.exports = userapp;