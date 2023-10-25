const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import {getUser} from "src/utils/controllers/user.controller";

const getSubscriptionDetails = async userId => {

  try {

    // Récupérer l'utilisateur à partir de l'identifiant
    const user = await getUser(userId)

    if (!user || !user.stripeCustomerId) {
     console.log('User not found or no Stripe customer ID associated');
    }

    // Récupérer les abonnements de l'utilisateur auprès de Stripe
    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
      customer: user.user_metadata.stripeCustomerId,
    });

    // Vérifier si l'utilisateur a un abonnement actif
    if (subscriptions.data.length === 0) {
      return {
        name: null,
        startDate: null,
        endDate: null,
        status: 'inactive',
      }
    }
    else{
      // Récupérer les détails de l'abonnement actif
      const activeSubscription = subscriptions.data[0];

      const planInfos = await stripe.products.retrieve(
        activeSubscription.items.data[0].price.product
      )

      return {
        name: planInfos.name,
        startDate: new Date(activeSubscription.current_period_start * 1000),
        endDate: new Date(activeSubscription.current_period_end * 1000),
        status: activeSubscription.status,
      }

    }





  } catch (error) {
    throw new Error(`Failed to get subscription details: ${error.message}`);
  }
}

module.exports = getSubscriptionDetails;
