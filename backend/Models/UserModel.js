const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["artisan", "consumer", "admin"], default: "consumer" },
  phone: { type: String },
  address: { 
    street: String, 
    city: String, 
    state: String, 
    country: String, 
    pincode: String 
  },
  profileImage: { type: String }, // URL
  createdAt: { type: Date, default: Date.now }
})
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;