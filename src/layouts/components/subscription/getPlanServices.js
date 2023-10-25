const stripe = require('stripe')('sk_test_51NOGk5BqdsYRwLDfL2DJleOgwAjg70ImwYEQMKCWFmg35kRLlQPPyPi4bMMXRkiKrrbMk4tCpCSZlU5vXEUT0GBj0062SXfgrV');

const getPlanServices = async (planId) => {
  try {
    // Récupérer le plan auprès de Stripe
    const plan = await stripe.products.retrieve(planId);

    // Vérifier si le plan a des produits associés
    if (!plan ||!plan.metadata || !plan.metadata.services) {
      console.log('Plan not found or does not have associated services');
    }

    // Les services sont stockés dans les métadonnées du produit sous forme de chaîne JSON
    return JSON.parse(plan.metadata.services);

  } catch (error) {
    console.log(`Failed to get plan services: ${error.message}`);
  }
};
