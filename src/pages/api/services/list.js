import { getServerSession } from "next-auth/next"
import { authOptions } from "src/pages/api/auth/[...nextauth]"

import connectToDatabase from "../../../utils/mongodb";
import Service from 'src/utils/models/rankerfox/services.model';

export default async function handler(req, res) {

    const session = await getServerSession(req, res, authOptions)

    if (!session) {

        return res.status(401).json({ message: 'Non autorisé ! INTERDIT ! ILLÉGAL !' }).send({
            error: "You must be signed in to view the protected content on this page.",
        });
    }


    try {
        await connectToDatabase()
        const availableServices = await Service.find({}, '-_id serviceName serviceImage available');

        res.status(200).json({ services: availableServices });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur ! Nan je vous le dit.' });
    }
}
