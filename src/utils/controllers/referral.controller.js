const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

import User from '../models/user.model'
import connectToDatabase from '../mongodb'

const getNewReferralCode = async () => {
  const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()

  await connectToDatabase()
  const user = await User.findOne({referralCode: referralCode})

  if (user) {
    return getNewReferralCode()
  }

  return referralCode
}

const checkReferralCode = async (referralCode) => {
  await connectToDatabase()
  const user = await User.findOne({referralCode: referralCode})

  return !!user;

}

const checkFreeSubscriptionAvailability = async (user) => {
  // On récupère le code de parrainage de l'utilisateur
  const parrainageCode = user.parrainage.code

  // On récupère les 3 utilisateurs ayant utilisé ce code
  const parraines = await User.find({parrainageCode})

  // On vérifie si ces 3 utilisateurs ont un abonnement actif chez Subify pour le mois en cours
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const parrainesSubscriptions = await Promise.all(
    parraines.map(async parraine => {
      const customerId = parraine.stripe.customerId

      return await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        created: {
          gte: currentMonthStart.getTime() / 1000,
          lte: currentMonthEnd.getTime() / 1000
        }
      })
    })
  )

  // On compte le nombre d'abonnements actifs pour chaque parrainé
  const activeSubscriptionsCount = parrainesSubscriptions.map(subscriptions => subscriptions.data.length)

  // On vérifie si chaque parrainé a au moins un abonnement actif
  const allParrainesHaveActiveSubscription = activeSubscriptionsCount.every(count => count > 0)

  // Si tous les parrainés ont un abonnement actif, on attribue un abonnement gratuit à vie au parrain
  if (allParrainesHaveActiveSubscription) {
    // On ajoute l'abonnement spécial au parrain
    const customerId = user.stripe.customerId
    await stripe.subscriptions.create({
      customer: customerId,
      items: [{price: process.env.SUBIFY_SPECIAL_PRICE_ID}]
    })
  }
}

module.exports = {getNewReferralCode, checkReferralCode, checkFreeSubscriptionAvailability}
