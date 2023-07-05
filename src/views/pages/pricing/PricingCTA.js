// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Image from "next/image";

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(11.25, 36),
  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.04),
  [theme.breakpoints.down('xl')]: {
    padding: theme.spacing(11.25, 20)
  },
  [theme.breakpoints.down('md')]: {
    textAlign: 'center'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 5)
  }
}))

const GridStyled = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    order: -1
  }
}))


const PricingCTA = () => {
  return (
    <BoxWrapper>
      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          <Typography variant='h5' sx={{ mb: 2.5, color: 'primary.main' }}>
            Pas convaincu ? Essayez gratuitement 7 Jours !
          </Typography>
          <Typography sx={{ mb: 10, color: 'text.secondary' }}>
            Obtenez l'accès à nos services gratuitement pendant 7 jours.
          </Typography>
          <Button variant='contained'>Démarrer l'essai gratuit</Button>
        </Grid>
        <GridStyled sx={'@media (max-width: 767px) { display:none }'} item xs={12} md={4}>
          <Image alt='Trial avatar'  src='/images/components/pricing/pricing-cta-avatar.png' loading={'lazy'} fill={true} objectFit='scale-down' objectPosition={'90% 10%'}/>
        </GridStyled>
      </Grid>
    </BoxWrapper>
  )
}

export default PricingCTA
