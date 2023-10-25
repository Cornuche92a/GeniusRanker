// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Button from "@mui/material/Button";
import {useRouter} from "next/router";

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)(({ theme }) => ({
    width: 40,
    height: 40,
    marginRight: theme.spacing(4)
}))

const PlanDetails = props => {

    const router = useRouter()

  const handleSubscription = (e) => {
    e.preventDefault()
    router.push('/dashboard/plan')
  }


  // ** Props
    const { data, color = 'primary', trend = 'positive' } = props

    const {planName, planStatus} = data

    return (
        <Card>
            <CardContent sx={{ py: theme => `${theme.spacing(4.125)} !important` }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar skin='light' color={color} variant='rounded'>
                        <Icon icon='eva:trending-up-fill' />
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                          { planName ? <Typography variant='h6'>{planName}</Typography> : <Button variant='contained' color='primary' onClick={handleSubscription}>S'abonner </Button>}
                        </Box>
                      { planStatus === 'active' ? (<Typography variant='caption'>Mon plan actuel</Typography>) : null}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default PlanDetails
