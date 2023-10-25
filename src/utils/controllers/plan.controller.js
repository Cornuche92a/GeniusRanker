const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getPlansDetails = async () => {

  const product1 = await stripe.products.retrieve(
    'prod_OAjYMbpQ7ZuVdk'
  );

  const price1monthly = await stripe.prices.retrieve(
    'price_1NOO5jBqdsYRwLDfpCJ9tctk'
  );

  const price1annualy = await stripe.prices.retrieve(
    'price_1NOQKbBqdsYRwLDf4FTxqj5p'
  );


  // Product 2
  const product2 = await stripe.products.retrieve(
    'prod_OAjrJl0XT0irmw'
  );

  const price2monthly = await stripe.prices.retrieve(
    'price_1NOOO4BqdsYRwLDfvCeOvM1h'
  );

  const price2annualy = await stripe.prices.retrieve(
    'price_1NP1xiBqdsYRwLDf5RmWi5hH'
  );


  // Product 3
  const product3 = await stripe.products.retrieve(
    'prod_OBOHbNEyZLK99s'
  );

  const price3monthly = await stripe.prices.retrieve(
    'price_1NP1UpBqdsYRwLDflTM0xYkO'
  );

  const price3annualy = await stripe.prices.retrieve(
    'price_1NP1UpBqdsYRwLDfMlWRP27o'
  );

  return JSON.parse(JSON.stringify([
    {
      "id": "price_1NOO5jBqdsYRwLDfpCJ9tctk",
      "imgWidth": 100,
      "title": product1.name,
      "imgHeight": 100,
      "monthlyPrice": price1monthly.unit_amount / 100,
      "currentPlan": false,
      "popularPlan": false,
      "subtitle": "A simple start for everyone",
      "imgSrc": "/images/components/pricing/essential.png",
      "yearlyPlan": {
        "id": "price_1NP1xiBqdsYRwLDf5RmWi5hH",
        "perMonth": ((price1annualy.unit_amount / 12) / 100).toFixed(2),
        "totalAnnual": price1annualy.unit_amount / 100
      },
      "planBenefits": [
        "Semrush",
        "Exploding Topics",
        "Storyblocks",
        "Smudge",
        "Moz"
      ]
    },
    {
      "id":"price_1NOOO4BqdsYRwLDfvCeOvM1h",
      "imgWidth": 100,
      "imgHeight": 100,
      "monthlyPrice": price2monthly.unit_amount / 100,
      "title": product2.name,
      "popularPlan": true,
      "currentPlan": false,
      "subtitle": "For small to medium businesses",
      "imgSrc": "/images/components/pricing/advanced.png",
      "yearlyPlan": {
        "id": "price_1NP1xiBqdsYRwLDf5RmWi5hH",
        "perMonth": ((price2annualy.unit_amount_decimal / 12) / 100).toFixed(2),
        "totalAnnual": price2annualy.unit_amount / 100
      },
      "planBenefits": [
        "All on Essential",
        "Semrush Guru",
        "SpyFu",
        "Text Optimizer",
        "Woorank"
      ]
    },
    {
      "id":"price_1NP1UpBqdsYRwLDflTM0xYkO",
      "imgWidth": 100,
      "imgHeight": 100,
      "monthlyPrice": price3monthly.unit_amount / 100,
      "popularPlan": false,
      "currentPlan": false,
      "title": product3.name,
      "subtitle": "Solution for big organizations",
      "imgSrc": "/images/components/pricing/pro.png",
      "yearlyPlan": {
        "id":"price_1NP1UpBqdsYRwLDfMlWRP27o",
        "perMonth": ((price3annualy.unit_amount_decimal / 12) / 100).toFixed(2),
        "totalAnnual": price3annualy.unit_amount / 100
      },
      "planBenefits": [
        "All on Advanced",
        "Seodity",
        "Serpstat",
        "Hunter.io",
        "Dinorank"
      ]
    }
  ]))


}

export default getPlansDetails
