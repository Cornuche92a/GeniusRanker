import { getServerSession } from 'next-auth'
import csrf from '/src/utils/csrf'
import { deleteUser } from '/src/utils/controllers/user.controller'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  try {
    if (req.method !== 'DELETE') {
      res.status(405).json({ message: 'Method Not Allowed' })

      return
    }

    await csrf(req, res)

    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' })

      return
    }

    await deleteUser(session.user.sub)

    res.status(200).json({ message: 'Supprimé avec succès.' })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' + error })
  }
}
