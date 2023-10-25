// pages/api/stripe-webhook.js

import { buffer } from 'micro'
import Stripe from 'stripe'
import {createSubscription, deleteSubscription, updateSubscription} from 'src/utils/controllers/subscribe.controller'
import {getUser, deleteUser} from "src/utils/controllers/user.controller";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
}

const webhookHandler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const signature = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), signature, webhookSecret)
    } catch (error) {
      console.error(`Webhook error: ${error.message}`)

      return res.status(400).send(`Webhook Error: ${error.message}`)

    }

    // Traiter les événements Stripe selon leur type
    switch (event.type) {
      case 'customer.subscription.deleted':
        // L'événement pour une annulation d'abonnement
        // Traiter ici les actions à effectuer lorsqu'un abonnement est annulé

        await deleteSubscription(event.data.object).then(
          data => {
            res.status(data.status)
          }
        )

        break
      case 'customer.subscription.updated':

        await updateSubscription(event.data.object).then(
          data => {
            res.status(data.status)
          }
        )

        break
      case 'customer.subscription.created':

        await createSubscription(event.data.object).then(
          data => {
            res.status(data.status)

          }
        )

        break

      case 'customer.deleted' :

        const userId = event.data.object.metadata.id_utilisateur

        await deleteUser(userId).then(
            data => {
              res.status(data.status)
            }
        )
        break

      // Ajouter d'autres cas pour d'autres types d'événements Stripe

      default:
        console.warn(`Unhandled event type: ${event.type}`)
        break
    }

    res.status(200).json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default webhookHandler
