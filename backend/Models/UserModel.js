const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema=new mongoose.Schema({
  clerkId:{type:String,required:true},
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["artisan", "customer", "admin"], default: "consumer" },
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
},{"strict":"throw"})

// Hash password before saving
userSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// method to compare password
userSchema.methods.matchPassword = function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
};

// optional: prevent password from being returned in res automatically
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;