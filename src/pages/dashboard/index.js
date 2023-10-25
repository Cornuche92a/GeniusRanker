// Backend
import { getServerSession } from 'next-auth/next'
import {authOptions} from "src/pages/api/auth/[...nextauth]";
import getPlansDetails from "src/utils/controllers/plan.controller";
import getClientStats from "src/utils/controllers/stats.controller";
import getSubscriptionDetails from 'src/layouts/components/subscription/getSubscriptionDetails'

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// ** Custom Components
import UserViewServices from "src/views/pages/dashboard/UserViewServices";
import UserViewWelcome from "src/views/pages/dashboard/UserViewWelcome";
import SavingDetails from 'src/layouts/components/cards/dashboard/SavingDetails'
import PricingPlans from "src/views/pages/pricing/PricingPlans";
import Spinner from "src/@core/components/spinner";

// ** SWR
import useSWR from "swr";

// ** CSRF
import csrf from 'src/utils/csrf'

// ** Icon
import {Icon} from "@iconify/react";
import UserViewErrorListing from "../../views/pages/dashboard/list/UserViewErrorListing";

const fetcher = url => fetch(url).then(r => r.json())

function Dashboard (props) {


  const { session, stats, pricingPlans, plan, csrfToken } = props.apiData



  const { data, error, isLoading } = useSWR('/api/services/list', fetcher, {revalidateOnFocus : true, revalidateOnReconnect : true, refreshInterval : 30000})


    if(error) return <div>Erreur : {error}</div>

    if(isLoading) return <Spinner/>

    if(!data) return <div>Pas de services</div>


  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        <UserViewWelcome data={session.user} />
        </Grid>
        <Grid item xs={12}>
          {stats && (
            <Grid container spacing={6}>
              {stats.map((item, index) => {

                return (
                  <Grid item xs={12} md={3} sm={6} key={index}>
                    <SavingDetails
                      {...item} icon={<Icon icon={item.icon} />} />
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Grid>
        { plan.status === 'inactive' ?
          <Grid item xs={12} md={12}>
            <Divider sx={{ my: 9, mt: 2 }} />
            <PricingPlans plan={'monthly'} data={pricingPlans} />
            <Divider sx={{ mt: 6 }} />
            </Grid> : null}
        <Grid item xs={12} md={12}>
          {isLoading ? <Spinner/> : null}
          { data.services ? <UserViewServices data={data.services} csrf={csrfToken} /> : <UserViewErrorListing/> }
          { data.services.available === false ? <UserViewErrorListing data={data.services} /> : null}
        </Grid>
        </Grid>

    </div>
  )

}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard


export async function getServerSideProps (context) {

  let apiData = {};

  const session = await getServerSession(context.req, context.res, authOptions)


  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const { req, res } = context
  await csrf(req, res)

  // Get CSRF Token
  apiData.csrfToken = req.csrfToken()

  // Get session
  apiData.session = session

  // Get client stats
  apiData.stats = await getClientStats(session.user.sub)

  // Get subscription details
  apiData.plan =  JSON.parse(JSON.stringify( await getSubscriptionDetails(session.user.sub)))


  // Get pricing plans if subscription is inactive
  if(apiData.plan.status === 'inactive') { apiData.pricingPlans = await getPlansDetails() }


    return {
      props: { apiData }
    }


}
