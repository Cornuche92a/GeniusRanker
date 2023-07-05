const Referral = require('../../models/referral.model')

//const User = require('../../models/UserModel')

import generateUniqueReferralCode from './getReferralCode'

const assignReferralCodeToUser = async user => {
  const code = await generateUniqueReferralCode()
  const now = new Date()

  const referralCode = new Referral({
    userId: user.sub,
    referralCode: code,
    createdAt: now,
    usageCount: 0,
    referredUsers: []
  })

  await referralCode.save() // enregistre le code de parrainage dans la base de données
  await User.findByIdAndUpdate(user.sub, { referralCode: code }) // assigne le code de parrainage à l'utilisateur
}

export default assignReferralCodeToUser
