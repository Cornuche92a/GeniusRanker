// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

//** Next Auth
import { signIn, useSession } from 'next-auth/react'

// ** React Imports
import { useRouter } from 'next/router';


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import Image from "next/image";
import axios from "axios";
import {useState} from "react";
import {Stack} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  paddingTop: theme.spacing(14.75),
  borderRadius: theme.shape.borderRadius
}))

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  '& > :not(:first-of-type)': {
    marginTop: theme.spacing(4)
  }
}))

const PlanDetails = props => {


  // ** Props
  const { plan, data } = props

  // ** States
  const [spinner, setSpinner] = useState(false)



  // ** Router
  const router = useRouter();

  // ** Session
  const { data: session } = useSession()


  const handleSubscribe = async () => {

    console.log('data ',data)

    setSpinner(true)


    if (session) {
      let response;

      if(plan === 'monthly') {
        response = await axios.post('/api/user/subscribe/initiate', {new_plan_id: data.id }).then(
          data => {

            setSpinner(false)

            return data

          }
        );

      }
      if(plan === 'annually') {
        response = await axios.post('/api/user/subscribe/initiate', { new_plan_id: data.yearlyPlan.id }).then(

          data => {

            setSpinner(false)

            return data

          }
        );

      }

      const { url } = response.data;

      // Effectuer une redirection côté serveur vers l'URL de paiement de Stripe
       await router.replace(url);

    } else {
      await signIn('auth0')
    }
  }

  const renderFeatures = () => {
    return data?.planBenefits.map((item, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component='span' sx={{ display: 'inline-flex', color: 'text.secondary', mr: 2 }}>
          <Icon icon='mdi:circle-outline' fontSize='0.75rem' />
        </Box>
        <Typography variant='body2'>{item}</Typography>
      </Box>
    ))
  }



  return (
    <BoxWrapper
      sx={{
        border: theme =>
          !data?.popularPlan
            ? `1px solid ${theme.palette.divider}`
            : `1px solid ${hexToRGBA(theme.palette.primary.main, 0.5)}`
      }}
    >
      {data?.popularPlan ? (
        <CustomChip
          skin='light'
          label='Popular'
          color='primary'
          sx={{
            top: 12,
            right: 12,
            height: 24,
            position: 'absolute',
            '& .MuiChip-label': {
              px: 1.75,
              fontWeight: 600,
              fontSize: '0.75rem'
            }
          }}
        />
      ) : null}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
        <Image
          width={data?.imgWidth}
          src={data?.imgSrc}
          loading={'lazy'}
          height={data?.imgHeight}
          alt={`${data?.title.toLowerCase().replace(' ', '-')}-plan-img`}
        />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h5' sx={{ mb: 1.5 }}>
          {data?.title}
        </Typography>
        <Typography variant='body2'>{data?.subtitle}</Typography>
        <Box sx={{ my: 7, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='body2' sx={{ mt: 1.6, fontWeight: 600, alignSelf: 'flex-start' }}>
              €
            </Typography>
            <Typography variant='h3' sx={{ fontWeight: 600, color: 'primary.main', lineHeight: 1.17 }}>
              {plan === 'monthly' ? data?.monthlyPrice : data?.yearlyPlan.perMonth}
            </Typography>
            <Typography variant='body2' sx={{ mb: 1.6, fontWeight: 600, alignSelf: 'flex-end' }}>
              /month
            </Typography>
          </Box>
          {plan !== 'monthly' && data?.monthlyPrice !== 0 ? (
            <Typography
              variant='caption'
              sx={{ top: 50, left: '50%', position: 'absolute', transform: 'translateX(-50%)' }}
            >{`EUR ${data?.yearlyPlan.totalAnnual}/year`}</Typography>
          ) : null}
        </Box>
      </Box>
      <BoxFeature>{renderFeatures()}</BoxFeature>


      { spinner ?


          <Stack sx={{ width: '100%'}}>
            <LinearProgress color='info' />
          </Stack>
     :

         session?.user.vip === data?.title ?
          <Button
            fullWidth
            disabled={true}
            color={data?.currentPlan ? 'success' : 'primary'}
            variant={data?.popularPlan ? 'contained' : 'outlined'}
          >
            MY PLAN
          </Button>

          :

          session && (session.user.vip !== null) ?
            <Button
              fullWidth
              onClick={ handleSubscribe}
              color={data?.currentPlan ? 'success' : 'primary'}
              variant={data?.popularPlan ? 'contained' : 'outlined'}
            >
              {data?.currentPlan ? 'MY PLAN' : 'CHANGE PLAN'}
            </Button>

            :

            <Button
              fullWidth
              onClick={ handleSubscribe}
              color={data?.currentPlan ? 'success' : 'primary'}
              variant={data?.popularPlan ? 'contained' : 'outlined'}
            >
              {session?.user?.trialused ? 'START PLAN' : 'START 7-DAYS FREE TRIAL'}
            </Button>



      }


    </BoxWrapper>
  )
}

export default PlanDetails
