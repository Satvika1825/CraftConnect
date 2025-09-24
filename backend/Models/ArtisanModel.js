const mongoose=require('mongoose');
const artisanSchema=mongoose.Schema({  
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopName: { type: String, required: true },
  bio: { type: String },
  craftType: { type: String }, // pottery, weaving, etc.
  location: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
})

const artisanModel=mongoose.model('artisan',artisanSchema);
module.exports=artisanModel;