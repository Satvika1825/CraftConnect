const mongoose=require('mongoose');
const reviewSchema=mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
})
const reviewModel=mongoose.model('review',reviewSchema);
module.exports=reviewModel;