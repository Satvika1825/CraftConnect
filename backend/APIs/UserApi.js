const exp=require('express');
const userapp=exp.Router();
const expressAsyncHandler=require('express-async-handler');
const userModel=require('../Models/UserModel');
const cors = require("cors");

userapp.use(cors(
    { origin: 'http://localhost:8080', // allow requests from any origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));
//API
userapp.post('/user', expressAsyncHandler(async (req, res) => {
    const { clerkId, email, role, name } = req.body;

    if (!clerkId || !email || !role) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const userInDb = await userModel.findOne({ clerkId });

    if (userInDb) {
        if (userInDb.role === role) {
            return res.status(200).send({ message: "User exists", user: userInDb });
        } else {
            return res.status(400).send({ message: "Clerk ID already registered with different role" });
        }
    }

    const newUser = new userModel({ clerkId, email, role, name });
    const savedUser = await newUser.save();

    res.status(201).send({ message: "User created", user: savedUser });
}));

// ---------------- GET /users/:id → Get profile details ----------------
userapp.get('/user/:clerkId', expressAsyncHandler(async (req, res) => {
    try {
        const user = await userModel.findOne({clerkId: req.params.clerkId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- PUT /users/:id → Update profile info ----------------
userapp.put('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // returns updated doc + validates schema
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- DELETE /users/:id → Delete account ----------------
userapp.delete('/users/:id', expressAsyncHandler(async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

module.exports=userapp;