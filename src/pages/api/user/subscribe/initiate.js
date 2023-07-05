import { getServerSession } from 'next-auth'

// get User
import {getUser} from 'src/utils/controllers/user.controller'

import Stripe from 'stripe';
import {authOptions} from "src/pages/api/auth/[...nextauth]";

// Initialiser la connexion à l'API Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const user = await getUser(session.user.sub)
  const customer_id = user.user_metadata.stripeCustomerId
  const trialused = user.app_metadata.trialused

  try {
    // Vérifier si l'utilisateur a un abonnement existant dans Stripe
    const subscriptions = await stripe.subscriptions.list({ customer: customer_id });

    if (subscriptions.data.length > 0) {

      // L'utilisateur a déjà un abonnement

      // Créer la modification de l'abonnement avec les options de prorata
      const session = await stripe.billingPortal.sessions.create({
        configuration: process.env.STRIPE_PORTAL_CONFIG,
        customer: customer_id,
        return_url: process.env.URL+'/dashboard/plan',
      });

      // Rediriger vers la page de paiement de Stripe pour le prorata
      return res.status(200).json({ url: session.url });
    }

    // Initialiser un nouveau checkout pour un abonnement
    const { new_plan_id } = req.body; // L'ID du nouveau plan d'abonnement

    const sessionCheckout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer_id,
      line_items: [
        {price: new_plan_id, quantity: 1},
      ],
      subscription_data: {
        trial_period_days: trialused ? undefined : process.env.TRIAL_TIME, // Essai gratuit de 7 jours si l'utilisateur n'a pas encore utilisé son essai gratuit
      },
      success_url: process.env.URL+'/pricing', // URL de succès de paiement
      cancel_url: process.env.URL+'/pricing', // URL d'annulation de paiement
    });

    // Rediriger vers la page de paiement de Stripe

    return res.status(200).json({ url: sessionCheckout.url })

  } catch (error) {

    console.error(error);

    return res.status(500).json({ error: 'Internal server error' });

  }

}
