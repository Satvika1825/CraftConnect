const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true,
    unique: true 
  },
  name: { 
    type: String 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ["artisan", "customer", "admin"], 
    default: "customer" // Fixed: was "consumer", should be "customer" to match enum
  },
  approved: {
    type: Boolean,
    default: function() {
      // Artisans need admin approval, others are auto-approved
      return this.role !== 'artisan';
    }
  },
  phone: { 
    type: String 
  },
  address: { 
    street: String, 
    city: String, 
    state: String, 
    country: String, 
    pincode: String 
  },
  profileImage: { 
    type: String 
  }, // URL
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  strict: "throw",
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ approved: 1 });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  // Only hash if password exists
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Method to compare password
userSchema.methods.matchPassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Prevent password from being returned in responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;