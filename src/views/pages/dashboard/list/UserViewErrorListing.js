// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'

// ** IMAGE
import ForbiddenImage from 'public/images/pages/error-cloud.png'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Next Image
import Image from "next/image";

// Styled Box component
const StyledBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        borderRight: `1px solid ${theme.palette.divider}`
    }
}))

const UserViewErrorListing = () => {
    return (
        <Card sx={{borderColor: '#fc2f4f'}}>
            <Grid container spacing={6} >
                <Grid item xs={12} sm={7}>
                    <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
                        <Typography variant='h6' sx={{ mb: 2 }}>
                            Accès impossible
                        </Typography>
                        <Typography variant='body2'>
                            Une erreur est survenue durant la récupération des services.
                            Plusieurs raisons peuvent expliquer ce problème :
                        </Typography>
                        <Divider sx={{ my: theme => `${theme.spacing(7)} !important` }} />
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={5}>
                                <StyledBox>
                                    <Box
                                        sx={{
                                            py: 1.25,
                                            mb: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            '& svg': { color: 'primary.main', mr: 2.5 }
                                        }}
                                    >
                                        <Icon icon='mdi:lock-open-outline' fontSize={20} />
                                        <Typography variant='body2'>Vous êtes banni</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            py: 1.25,
                                            display: 'flex',
                                            alignItems: 'center',
                                            '& svg': { color: 'primary.main', mr: 2.5 }
                                        }}
                                    >
                                        <Icon icon='mdi:account-outline' fontSize={20} />
                                        <Typography variant='body2'>Vous n'êtes plus abonné(e)</Typography>
                                    </Box>
                                </StyledBox>
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                <Box
                                    sx={{
                                        py: 1.25,
                                        mb: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        '& svg': { color: 'primary.main', mr: 2.5 }
                                    }}
                                >
                                    <Icon icon='mdi:network' fontSize={20} />
                                    <Typography variant='body2'>Erreur de réseau</Typography>
                                </Box>
                                <Box
                                    sx={{ py: 1.25, display: 'flex', alignItems: 'center', '& svg': { color: 'primary.main', mr: 2.5 } }}
                                >
                                    <Icon icon='mdi:bug' fontSize={20} />
                                    <Typography variant='body2'>Erreur interne</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Grid>
                <Grid
                    item
                    sm={5}
                    xs={12}
                    sx={{ pt: ['0 !important', '1.5rem !important'], pl: ['1.5rem !important', '0 !important'] }}
                >
                    <CardContent
                        sx={{
                            height: '100%',
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(252,47,79,0.34)',
                        }}
                    >
                        <div>
                           <Image src={ForbiddenImage} alt="interdit" loading={'lazy'} width={'133'} height={'133'}/>
                        </div>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    )
}

export default UserViewErrorListing
