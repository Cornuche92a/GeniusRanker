const Referral = require('../../models/referral.model')

async function findCodeByValue(value) {
  return Referral.findOne({ code: value })
}

export default findCodeByValue
