const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// ** Next Auth
import { useSession } from 'next-auth/react'

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent from '@mui/material/CardContent'

// ** Demo Imports
import PricingCTA from 'src/views/pages/pricing/PricingCTA'
import PricingTable from 'src/views/pages/pricing/PricingTable'
import PricingPlans from 'src/views/pages/pricing/PricingPlans'
import PricingHeader from 'src/views/pages/pricing/PricingHeader'
import PricingFooter from 'src/views/pages/pricing/PricingFooter'

// ** Styled Components
const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: `${theme.spacing(20, 36)} !important`,
  [theme.breakpoints.down('xl')]: {
    padding: `${theme.spacing(20)} !important`
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(10, 5)} !important`
  }
}))

const Pricing = ({ apiData }) => {
  // ** States
  const [plan, setPlan] = useState('annually')

  const { data: session } = useSession()

  const handleChange = e => {
    if (e.target.checked) {
      setPlan('annually')
    } else {
      setPlan('monthly')
    }
  }

  return (
    <Card>
      <CardContent>
        <PricingHeader plan={plan} handleChange={handleChange} />
        <PricingPlans plan={plan} data={apiData.pricingPlans} />
      </CardContent>
      {
        !session?.user.trialUsed ?
        <PricingCTA /> : null

      }
      <CardContent>
        <PricingTable data={apiData} />
      </CardContent>
      <CardContent sx={{ backgroundColor: 'action.hover' }}>
        <PricingFooter data={apiData.faq} />
      </CardContent>
    </Card>
  )
}


export const getStaticProps = async () => {

  // Product 1
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

  const apiData = {
    "pricingPlans": [
      {
        "imgWidth": 100,
        "title": product1.name,
        "imgHeight": 100,
        "monthlyPrice": price1monthly.unit_amount / 100,
        "currentPlan": false,
        "popularPlan": false,
        "subtitle": "A simple start for everyone",
        "imgSrc": "/images/components/pricing/essential.png",
        "yearlyPlan": {
          "perMonth": ((price1annualy.unit_amount / 12) / 100).toFixed(2),
          "totalAnnual": price1annualy.unit_amount / 100
        },
        "planBenefits": [
          "100 responses a month",
          "Unlimited forms and surveys",
          "Unlimited fields",
          "Basic form creation tools",
          "Up to 2 subdomains"
        ]
      },
      {
        "imgWidth": 100,
        "imgHeight": 100,
        "monthlyPrice": price2monthly.unit_amount / 100,
        "title": product2.name,
        "popularPlan": true,
        "currentPlan": false,
        "subtitle": "For small to medium businesses",
        "imgSrc": "/images/components/pricing/advanced.png",
        "yearlyPlan": {
          "perMonth": ((price2annualy.unit_amount_decimal / 12) / 100).toFixed(2),
          "totalAnnual": price2annualy.unit_amount / 100
        },
        "planBenefits": [
          "Unlimited responses",
          "Unlimited forms and surveys",
          "Instagram profile page",
          "Google Docs integration",
          "Custom “Thank you” page"
        ]
      },
      {
        "imgWidth": 100,
        "imgHeight": 100,
        "monthlyPrice": price3monthly.unit_amount / 100,
        "popularPlan": false,
        "currentPlan": false,
        "title": product3.name,
        "subtitle": "Solution for big organizations",
        "imgSrc": "/images/components/pricing/pro.png",
        "yearlyPlan": {
          "perMonth": ((price3annualy.unit_amount_decimal / 12) / 100).toFixed(2),
          "totalAnnual": price3annualy.unit_amount / 100
        },
        "planBenefits": [
          "PayPal payments",
          "Logic Jumps",
          "File upload with 5GB storage",
          "Custom domain support",
          "Stripe integration"
        ]
      }
    ],
    "faq": [
      {
        "id": 1,
        "question": "What is Lorem Ipsum?",
        "answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      },
      {
        "id": 2,
        "question": "What is Lorem Ipsum?",
        "answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      },
      {
        "id": 3,
        "question": "What is Lorem Ipsum?",
        "answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      },
    ]
  }

  return {
    props: {
      apiData
    },
    revalidate: 30
  }
}

Pricing.guestGuard = true

export default Pricing
