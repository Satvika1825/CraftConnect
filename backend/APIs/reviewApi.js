const exp = require("express");
const reviewapp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const reviewModel = require("../Models/ReviewModel");

// ---------------- POST /reviews → Add review ----------------
reviewapp.post("/reviews", expressAsyncHandler(async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        if (!productId || !userId || !rating) {
            return res.status(400).json({ message: "productId, userId, and rating are required" });
        }

        const newReview = new reviewModel({ productId, userId, rating, comment });
        const savedReview = await newReview.save();

        res.status(201).json({ message: "Review added successfully", review: savedReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- GET /reviews/:productId → View all reviews for a product ----------------
reviewapp.get("/reviews/:productId", expressAsyncHandler(async (req, res) => {
    try {
        const reviews = await reviewModel.find({ productId: req.params.productId })
            .populate("userId", "name email")  // show reviewer details
            .sort({ createdAt: -1 }); // latest first

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// ---------------- DELETE /reviews/:id → Remove review ----------------
reviewapp.delete("/reviews/:id", expressAsyncHandler(async (req, res) => {
    try {
        const deletedReview = await reviewModel.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

module.exports = reviewapp;
