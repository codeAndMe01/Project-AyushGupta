const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email format validation
  },
  password: { 
    type: String, 
    required: true 
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is modified or new
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password for login
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
