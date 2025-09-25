const exp = require("express");
const artisanapp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const artisanModel = require("../Models/ArtisanModel");
const userModel = require("../Models/UserModel");

// Create artisan profile
artisanapp.post(
  "/artisan",
  expressAsyncHandler(async (req, res) => {
    const { userId, shopName, bio, craftType, location } = req.body;

    // check if user exists & has artisan role
    const user = await userModel.findById(userId);
    if (!user || user.role !== "artisan") {
      return res.status(400).send({ message: "User must exist with role artisan" });
    }

    // check if artisan profile already exists
    const artisanInDb = await artisanModel.findOne({ userId });
    if (artisanInDb) {
      return res.status(400).send({ message: "Artisan profile already exists" });
    }

    const newArtisan = new artisanModel({ userId, shopName, bio, craftType, location });
    const artisanDoc = await newArtisan.save();

    res.status(201).send({ message: "Artisan profile created", artisan: artisanDoc });
  })
);

// Get artisans with filters and populated user details

artisanapp.get("/artisans", expressAsyncHandler(async (req, res) => {
    const { craftType, shopName, location, verified, rating } = req.query;

    // Build filter object dynamically
    let filter = {};

    if (craftType) {
        filter.craftType = { $regex: craftType, $options: "i" }; // case-insensitive match
    }

    if (shopName) {
        filter.shopName = { $regex: shopName, $options: "i" }; // partial search
    }

    if (location) {
        filter.location = { $regex: location, $options: "i" };
    }

    if (verified !== undefined) {
        filter.verified = verified === "true"; // convert query string to boolean
    }

    if (rating) {
        filter.rating = { $gte: Number(rating) }; // greater or equal to minRating
    }

    // Fetch artisans with populated user details
    const artisans = await artisanModel.find(filter)
        .populate("userId", "name email profileImage phone address")
        //.populate("products");

    res.json({ count: artisans.length, artisans });
}));
//get articles by id
artisanapp.get("/artisans/:id", expressAsyncHandler(async (req, res) => {
    const artisan = await artisanModel.findById(req.params.id)
        .populate("userId", "name email profileImage phone address")
        //.populate("products"); // if you have a Product model
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
