// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'

// ** Next Image
import Image from "next/image";

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('Img')(({ theme }) => ({
  right: 10,
  bottom: 0,
  width: 290,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const UserViewWelcome = (user) => {

  const {firstname} = user.data

  // ** Hook
  const theme = useTheme()

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              Bienvenue{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {firstname}
              </Box>
              {' '}! 🎉
            </Typography>
            <Typography variant='body2'>
              Vous avez fait des{' '}
              <Box component='span' sx={{ fontWeight: 600 }}>
                économies
              </Box>{' '}
              😎 ce mois-ci.
            </Typography>
            <Typography sx={{ mb: 4.5 }} variant='body2'>
              Jetez-y un coup d'œil !
            </Typography>
            <Button variant='contained'>Voir les détails</Button>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations John' src={`/images/components/UserViewWelcome/john-light.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UserViewWelcome
