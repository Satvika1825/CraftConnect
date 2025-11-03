const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true,
    unique: true // This already creates an index
  },
  name: { 
    type: String 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // This already creates an index
  },
  password: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ["artisan", "customer", "admin"], 
    default: "customer"
  },
  approved: {
    type: Boolean,
    default: function() {
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
  },
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
  timestamps: true
});

// Only index fields that DON'T have unique: true
// DON'T add these (they cause duplicate warnings):
// userSchema.index({ clerkId: 1 }); ❌
// userSchema.index({ email: 1 });   ❌

// Only add indexes for non-unique fields:
userSchema.index({ role: 1 });
userSchema.index({ approved: 1 });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
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