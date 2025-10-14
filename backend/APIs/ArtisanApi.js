const exp = require("express");
const artisanapp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const artisanModel = require("../Models/ArtisanModel");
const userModel = require("../Models/UserModel");
const cors = require("cors");

artisanapp.use(cors(
    { origin: ['http://localhost:8080','https://craft-connect-blond.vercel.app'],// allow requests from any origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));
// Create artisan profile
artisanapp.post(
  "/artisan",
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId, shopName, bio, craftType, location } = req.body;

      // find user by clerkId
      const user = await userModel.findOne({ clerkId: userId });
      if (!user || user.role !== "artisan") {
        return res.status(400).json({ message: "User must exist with role artisan" });
      }

      // check if artisan profile already exists
      const artisanInDb = await artisanModel.findOne({ userId: user._id });
      if (artisanInDb) {
        return res.status(400).json({ message: "Artisan profile already exists" });
      }

      // Create new artisan with user's MongoDB _id
      const newArtisan = new artisanModel({
        userId: user._id, // Use MongoDB _id instead of clerkId
        shopName,
        bio,
        craftType,
        location
      });

      const artisanDoc = await newArtisan.save();
      res.status(201).json({ message: "Artisan profile created", artisan: artisanDoc });
    } catch (error) {
      console.error("Artisan creation error:", error);
      res.status(500).json({ message: "Error creating artisan profile", error: error.message });
    }
  })
);

// Get artisans with filters and populated user details
artisanapp.get("/artisans", expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const artisan = await artisanModel.findOne({ userId })
      .populate('userId')
      .populate('products');  // Now this will work because products is defined in schema

    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.json(artisan);
  } catch (error) {
    console.error('Error fetching artisan:', error);
    res.status(500).json({ message: "Error fetching artisan", error: error.message });
  }
}));

//get articles by id
artisanapp.get("/artisan/:id", expressAsyncHandler(async (req, res) => {
    const artisan = await artisanModel.findById(req.params.id)
        .populate("userId", "name email profileImage phone address")
        .populate("products"); // if you have a Product model
    if (!artisan) return res.status(404).json({ message: "Artisan not found" });
    res.json(artisan);
}));

//upadate artisan
artisanapp.patch("/artisans/:id", expressAsyncHandler(async (req, res) => {
    const allowedUpdates = ["shopName", "bio", "craftType", "location", "rating", "verified"];
    const updates = {};

    for (let key of allowedUpdates) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const artisan = await artisanModel.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    ).populate("userId", "name email profileImage phone address");

    if (!artisan) return res.status(404).json({ message: "Artisan not found" });

    res.json({ message: "Artisan updated successfully", artisan });
}));
//delete artisan
artisanapp.delete("/artisans/:id", expressAsyncHandler(async (req, res) => {
    const artisan = await artisanModel.findByIdAndDelete(req.params.id);
    if (!artisan) return res.status(404).json({ message: "Artisan not found" });
    res.json({ message: "Artisan deleted successfully" });
}));


module.exports = artisanapp;
