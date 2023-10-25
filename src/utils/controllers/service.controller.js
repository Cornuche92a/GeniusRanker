// service.controller.js
import connectToDatabase from 'src/utils/mongodb'; // Assurez-vous d'importer correctement la fonction pour la connexion à la base de données
import Service from 'src/utils/models/rankerfox/services.model';

// Cette fonction renvoie tous les services disponibles
export async function getAllServices() {
  await connectToDatabase();

  return Service.find({ available: true });
}

// Cette fonction renvoie un service spécifique par son nom
export async function getServiceByName(serviceName, filter = '') {
  await connectToDatabase();

  return Service.findOne({ serviceName: serviceName }).select(filter);
}

// Cette fonction crée un nouveau service
export async function createService(serviceData) {
  await connectToDatabase();

  return Service.create(serviceData);
}

// Cette fonction met à jour un service existant
export async function updateService(serviceName, updatedServiceData) {
  await connectToDatabase();

  return Service.findOneAndUpdate({ serviceName: serviceName }, updatedServiceData, { new: true });
}

// Cette fonction supprime un service par son nom
export async function deleteServiceByName(serviceName) {
  await connectToDatabase();

  return Service.findOneAndDelete({ serviceName: serviceName });
}
