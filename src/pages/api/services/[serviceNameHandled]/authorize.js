import { getServerSession } from "next-auth/next"
import { authOptions } from "src/pages/api/auth/[...nextauth]"

import csrf from 'src/utils/csrf'
import {getServiceByName} from "src/utils/controllers/service.controller";


export default async function handler(req, res) {

  // if (req.method !== 'POST')  return res.status(405).end()

  try {

    await csrf(req, res);

    const session = await getServerSession(req, res, authOptions);
    const subscription = session.user.vip;
    const { serviceNameHandled } = req.query;

    if (!session) return res.status(403).json({ message: 'ta daronne la timp' });
    if (!subscription) return res.status(403).json({ message: 'clochard' });

    const service = await getServiceByName(serviceNameHandled, 'available serviceData');

    console.log(service)

    if (!service) return res.status(404).json({ message: 'Service non trouvé' });
    if (!service.available) return res.status(403).json({ message: 'Service indisponible' });



    return res.status(200).json({
      name: serviceNameHandled,
      action: service.serviceData.action,
      tokens: service.serviceData.tokens
    });

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(401).json({ message: 'Unauthorized (Fils de pute) : ' + error.message });
    }

    return res.status(500).json({ message: 'Erreur serveur ! Nan je vous le dit.' });
  }

}
