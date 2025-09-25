const mongoose=require('mongoose');
const cartSchema=mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
},{"strict":"throw"})

const cartModel=mongoose.model('cart',cartSchema);
module.exports=cartModel;