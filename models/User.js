// Model for Users table

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 4
    },
    reputation: {
      type: Number,
      default: 50
  }
  },
    {
      timestamps: true
  });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
      const saltRounds = Number(process.env.SALT) || 10; 
      this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (error) {
      throw error; 
  }
});
  
  
  // Compare password method
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };


module.exports = mongoose.model('User', userSchema);