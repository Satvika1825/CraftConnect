const mongoose=require('mongoose');
const orderSchema=mongoose.Schema({
    consumerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  createdAt: { type: Date, default: Date.now }
},{"strict":"throw"})
const orderModel=mongoose.model('order',orderSchema);
module.exports=orderModel;