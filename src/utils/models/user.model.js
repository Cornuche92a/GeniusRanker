const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'client'
  },
  stripeCustomerId: {
    type: String,
    required: true,
    unique: true
  },
  subscriptionId: {
    type: String,
    required: false,
    unique: true
  },
  vip: {
    type: String,
    default: false
  },
  subscriptionStatus: {
    type: String,
    required: false
  },
  referralCode: {
    type: String,
    unique: true
  },
  trialused: {
    type: Boolean,
    default: false
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
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
  collection: 'users'
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);


module.exports = User;
