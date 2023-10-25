// MongoDB Connection
import connectToDatabase from '../mongodb'

// Mongoose User Model
import User from 'src/utils/models/user.model'

// Stripe initialisation
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// update user function
const { updateUser, getUser } = require('src/utils/controllers/user.controller')

const createSubscription = async (event) => {

  // Récupérer les données du produit et du plan
  const product = await stripe.products.retrieve(event.plan.product)

  // Récupérer le statut de l'abonnement
  const subscriptionStatus = event.status



  // Récupérer les données de l'utilisateur
  const customer = await stripe.customers.retrieve(event.customer)


  // Récupérer les metadata de l'utilisateur
  const {metadata} = customer

  // Récupérer l'id AUTH0 de l'utilisateur
  const userId = metadata.id_utilisateur

  // Vérifier que l'utilisateur n'a pas déjà eu d'essai gratuit (trialused)
  const user = await getUser(userId);

  // Si l'utilisateur a déjà utilisé son essai gratuit et qu'il est en période d'essai
  if (user && user.app_metadata.trialused && subscriptionStatus === 'trialing') {
    // L'utilisateur a déjà utilisé son essai gratuit
    return { status: 400 };
  }

  if(subscriptionStatus === ('trialing' || 'active')) {

    // Se connecter à MongoDB
    await connectToDatabase()

    // Récupérer le nom du produit
    const productName = product.name

    const appMetadataChanges = {vip: productName, trialused: subscriptionStatus === 'trialing'}

    // Enregister l'abonnement dans auth0
    await updateUser(userId, { appMetadataChange: appMetadataChanges})

    // Enregister l'abonnement dans MongoDB
    await User.findByIdAndUpdate(userId, {
      subscriptionId: event.id,
      subscriptionStatus: subscriptionStatus,
      vip: productName,
      trialused: subscriptionStatus === 'trialing'
    })

    console.log('subscription created :->')


    // Retourner l'abonnement à l'utilisateur
    return {status: 200};
  }

}

const updateSubscription = async (event) => {

  // Récupérer les données du produit et du plan
  const product = await stripe.products.retrieve(event.plan.product)

  // Récupérer le statut de l'abonnement
  const subscriptionStatus = event.status

  // Récupérer les données de l'utilisateur
  const customer = await stripe.customers.retrieve(event.customer)

  // Récupérer les metadata de l'utilisateur
  const {metadata} = customer

  // Récupérer l'id AUTH0 de l'utilisateur
  const userId = metadata.id_utilisateur


  // Vérifier que l'utilisateur n'a pas déjà eu d'essai gratuit (trialused)
  const user = await getUser(userId);

  // Si l'utilisateur a déjà utilisé son essai gratuit et qu'il est en période d'essai
  if (user && user.app_metadata.trialused && subscriptionStatus === 'trialing') {
    // L'utilisateur a déjà utilisé son essai gratuit
    return { status: 400 };
  }

  if(subscriptionStatus === 'trialing' || 'active') {

    // Se connecter à MongoDB
    await connectToDatabase()

    // Récupérer le nom du produit
    const productName = product.name

    const appMetadataChanges = {vip: productName, trialused: subscriptionStatus !== 'trialing' && user.app_metadata.trialused}

    // Enregister l'abonnement dans auth0
    await updateUser(userId, { appMetadataChange: appMetadataChanges})

    // Enregister l'abonnement dans MongoDB
    await User.findByIdAndUpdate(userId, {
      subscriptionId: event.id,
      subscriptionStatus: subscriptionStatus,
      vip: productName,
      trialused: subscriptionStatus === 'trialing'
    })

    console.log('subscription update :->')


    // Retourner l'abonnement à l'utilisateur
    return {status: 200};
  }

}

const deleteSubscription = async (event) => {

    // Se connecter à MongoDB
    await connectToDatabase()

    // Récupérer les données de l'utilisateur
    const customer = await stripe.customers.retrieve(event.customer)

    // Récupérer les metadata de l'utilisateur
    const { metadata } = customer

    // Récupérer l'id AUTH0 de l'utilisateur
    const userId = metadata.id_utilisateur

    // Enregister l'abonnement dans auth0
    await updateUser(userId,{appMetadataChange : {vip: null}})

    // Enregister l'abonnement dans MongoDB
    await User.findByIdAndUpdate(userId, {
      subscriptionId: null,
      subscriptionStatus: null,
      vip: null
    })

  console.log('abonnement supprimé :->')

  // Retourner l'abonnement à l'utilisateur
    return {status: 200};

}

const checkSubscription = async (userId) => {


  // Se connecter à MongoDB
  await connectToDatabase()

  try {
    // Supposons que vous ayez un modèle Mongoose pour les utilisateurs
    const userRecord = await User.findOne({ _id: userId });

    if (!userRecord) {

      console.log("Utilisateur non trouvé");

    }

    // Vérifiez si l'utilisateur a un abonnement actif
    return userRecord.subscriptionStatus === "active";

  } catch (error) {
    throw new Error("Erreur lors de la vérification de l'abonnement");
  }
}



module.exports = { createSubscription, deleteSubscription, updateSubscription }
