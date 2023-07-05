const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const ReferralModel = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  usageCount: { type: Number, default: 0 },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Referral', ReferralModel)
