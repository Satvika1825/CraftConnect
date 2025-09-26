const mongoose=require('mongoose');
const artisanSchema=mongoose.Schema({  

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  shopName: { type: String, required: true },
  bio: { type: String },
  craftType: { type: String }, // pottery, weaving, etc.
  location: {
    street: String, 
    city: String, 
    state: String, 
    country: String, 
    pincode: String 
},
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
},{"strict":"throw"})

const artisanModel=mongoose.model('artisan',artisanSchema);//all the operations are performed on the model i.e data base operations

module.exports=artisanModel;