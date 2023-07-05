// Auth0 initialisation
const { ManagementClient } = require('auth0')

// Stripe initialisation
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//Get new referral code function
const { getNewReferralCode } = require('src/utils/controllers/referral.controller')

// MongoDB Connection
import connectToDatabase from 'src/utils/mongodb'

// Mongoose User Model
import User from 'src/utils/models/user.model'

// Auth0 initialisation
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_API_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users'
})

// Get user from Auth0
const getUser = async userId => {
  try {
    const params = { id: userId }

    return await auth0.getUser(params)
  } catch (error) {
    throw new Error(error)
  }
}

const createUser = async (userId, userMetadata, appMetadata) => {
  const params = { id: userId }
  const user = await auth0.getUser(params)
  const { email, user_metadata } = user

  await connectToDatabase()

  if (await User.findOne({ _id: userId })) {
    throw new Error('User already exists')
  }

  try {

    async function getStripeCustomerId(){
      if(!user_metadata.stripeCustomerId){
        const customer = await stripe.customers.create({
          email: email,
          name: `${userMetadata.firstname} ${userMetadata.lastname}`,
          description: 'pd',
          phone: user_metadata.phone_number,
          metadata: {
            // des informations additionnelles que vous pouvez stocker
            id_utilisateur: userId
          }
        })

        return customer.id

      }
      else{
        return user_metadata.stripeCustomerId
      }
    }

    if (!user_metadata.firstname || !user_metadata.lastname || !user_metadata.stripeCustomerId) {

      userMetadata.stripeCustomerId = await getStripeCustomerId()

      await auth0.updateUserMetadata({ id: userId }, { ...userMetadata })
      await auth0.updateAppMetadata({ id: userId }, { ...appMetadata })
    }

    const newUser = new User({
      _id: userId,
      firstname: userMetadata.firstname,
      lastname: userMetadata.lastname,
      email: email,
      role: appMetadata.role || 'client',
      vip: appMetadata.vip || null,
      stripeCustomerId: await getStripeCustomerId(),
      referralCode: await getNewReferralCode(),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await newUser.save()

    return {
      firstname: userMetadata.firstname,
      lastname: userMetadata.lastname,
    }

  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

const updateUser = async (userId, { metadataChange, appMetadataChange}) => {
  try {
    const auth0params = { id: userId }
    const user = await auth0.getUser(auth0params);
    const { user_metadata, app_metadata } = user;

    if (!user) {
      return false;
    }

    // Update user metadata
    const updatedMetadata = { ...user_metadata, ...metadataChange };
    const updatedAppMetadata = { ...app_metadata, ...appMetadataChange };

    await auth0.updateUserMetadata(auth0params, updatedMetadata);
    await auth0.updateAppMetadata(auth0params, updatedAppMetadata);

    await connectToDatabase();

    await User.findOneAndUpdate(
      { _id: userId },
      {
        ...updatedMetadata,
        ...updatedAppMetadata,
        updatedAt: new Date()
      }
    );

    const userOnDB = await User.findById(userId);

    await stripe.customers.update(userOnDB.stripeCustomerId, {
      name: `${updatedMetadata.firstname} ${updatedMetadata.lastname}`
    });

    // Update user in database
  } catch (error) {
    console.log(error)
  }
};


const deleteUser = async userId => {
  try {
    const params = { id: userId }

    await auth0.deleteUser(params)
    await connectToDatabase()
    const user = await User.findOne({ _id: userId })
    await User.findByIdAndDelete(userId)
    await stripe.customers.del(user.stripeCustomerId)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { getUser, updateUser, createUser, deleteUser }
