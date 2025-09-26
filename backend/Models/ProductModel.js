const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "artisan", required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // pottery, textile, jewelry, etc.
  price: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  images: [String], // array of URLs
  rating: { type: Number, default: 0 }, // average rating
  isApproved: { type: Boolean, default: false }, // admin approval
  createdAt: { type: Date, default: Date.now },

},{"strict":"throw"})

const productModel=mongoose.model('product',productSchema);
module.exports=productModel;