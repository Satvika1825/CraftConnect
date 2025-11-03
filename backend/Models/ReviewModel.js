const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
