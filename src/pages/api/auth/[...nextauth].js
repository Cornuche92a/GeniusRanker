import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import { getUser } from 'src/utils/controllers/user.controller'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_DOMAIN
    })

    // ...add more providers here
  ],
  jwt: {
    secret: process.env.NEXT_AUTH_JWT_SECRET
  },
  pages:{
    newUser: '/register/'
},
  callbacks: {
    async session({ session, trigger,newSession, token }) {

      if (trigger === "update" && newSession?.firstName && newSession?.lastName) {
        session.user.firstName = newSession.firstName
        session.user.lastName = newSession.lastName
      }
        session = await getUser(token.sub)
        .then(auth0 => {
          // Send properties to the client, like an access_token and user id from a provider.
          session.user.sub = token.sub
          session.user.banned = auth0?.blocked || false
          session.user.vip = auth0?.app_metadata?.vip || null
          session.user.role = auth0?.app_metadata?.role || null
          session.user.firstname = auth0?.user_metadata?.firstname || ''
          session.user.lastname = auth0?.user_metadata?.lastname || ''
          session.user.trialused = auth0?.app_metadata?.trialused || false
        })
        .then(() => {
          return session
        })

      return session
    }
  }
}

export default NextAuth(authOptions)
