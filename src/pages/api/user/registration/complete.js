import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import csrf from 'src/utils/csrf'
import { createUser } from 'src/utils/controllers/user.controller'

const yup = require('yup')

export default async function handler(req, res) {
  await csrf(req, res).catch(err => {
    res.status(401).json({ message: 'Unauthorized : ' + err })
  })

  const session = await getServerSession(req, res, authOptions)

  const schema = yup.object({
    body: yup.object({
      name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, '❗️ Le prénom doit être valide.')
        .max(15)
        .required('❗ Le prénom est obligatoire.'),
      lastName: yup
        .string()
        .matches(/^[A-Za-z ]*$/, '❗️ Le nom doit être valide.')
        .max(15)
        .required('❗ Le nom de famille est obligatoire.'),
      referralCode: yup
        .string()
        .matches(/^[A-Za-z0-9]*$/, "❗️ Code d'invitation invalide.")
        .max(8),
      terms: yup
        .bool()
        .oneOf([true], '📃 Vous devez accepter les conditions.')
        .required('📃 Vous devez accepter les conditions.')
    })
  })

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' })
  }

  if (!session.user.lastname || !session.user.firstname) {
    try {

      const validate = schema => async req => {
        try {
          await schema.validate({
            body: req.body
          })

          return true
        } catch (err) {
          return false
        }
      }

      if (!(await validate(schema)(req))) {
        res.status(400).json({ message: 'Veuillez réessayer. Illégal.' })
      }

      // Créer un utilisateur dans MongoDB
        await createUser(session.user.sub, { firstname: req.body.name, lastname: req.body.lastName }, { vip: false, role: 'client', trialused: false})
          .then(data => {
            res.status(200).json({ firstName: data.firstname, lastName: data.lastname })
          })
          .catch(err => {
            res.status(400).json({ message: 'Veuillez réessayer. Erreur de création.' + err })

          })

    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la mise à jour des métadonnées utilisateur' + error, })
    }
  } else {
    res.status(500).json({ message: 'Vous avez déjà complété votre profil.' })
  }
}
