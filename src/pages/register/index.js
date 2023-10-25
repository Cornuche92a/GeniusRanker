// ** React Imports
import { useState, Fragment } from 'react'

// For logo
import Logo from '/public/images/logo.png'
import Image from 'next/image'

// Validator
import * as yup from 'yup'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import useMediaQuery from '@mui/material/useMediaQuery'
import { yupResolver } from '@hookform/resolvers/yup'
import FormHelperText from '@mui/material/FormHelperText'
import { useForm, Controller } from 'react-hook-form'
import Spinner from '../../@core/components/spinner'
import toast from 'react-hot-toast'
import csrf from 'src/utils/csrf'
import { getServerSession } from 'next-auth/next'
import { useSession } from 'next-auth/react'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import Head from "next/head";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

function Complete(props) {
  const {data: session, update} = useSession()

  const { csrfToken } = props
  const router = useRouter()

  // ** States
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [checkBox, setCheckBox] = useState(false)
  const [spinner, setSpinner] = useState(false)

  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z ]*$/, '❗️ Le prénom doit être valide.')
      .max(15)
      .required('❗ Le prénom est obligatoire.'),
    lastName: yup
      .string()
      .matches(/^[A-Za-z ]*$/, '❗️ Le nom doit être valide.')
      .max(15)
      .required('❗ Le nom de famille est obligatoire.'),
    referralCode: yup
      .string()
      .matches(/^[A-Za-z0-9]*$/, "❗️ Code d'invitation invalide.")
      .max(8),
    terms: yup
      .bool()
      .oneOf([true], '📃 Vous devez accepter les conditions.')
      .required('📃 Vous devez accepter les conditions.')
  })

  const defaultValues = {
    name: name,
    lastName: lastName,
    referralCode: referralCode,
    terms: checkBox
  }

  const nameChange = ({ target: { value } }) => {
    setValue('name', value)
  }

  const lastnameChange = ({ target: { value } }) => {
    setValue('lastName', value)
  }

  const referralCodeChange = ({ target: { value } }) => {
    setValue('referralCode', value)
  }

  const checkboxChange = ({ target: { checked } }) => {
    setCheckBox(checked)
    setValue('terms', checked)
  }

  async function updateName(firstName, lastName) {
if(session){
  await update({firstName: firstName, lastName: lastName})
}
  }

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  async function onSubmit() {
    //e.preventDefault()

    setSpinner(true)

    schema
      .validate(defaultValues)
      .then(async () => {
        const body = {
          name: name,
          lastName: lastName,
          referralCode: referralCode,
          terms: checkBox
        }

        setSpinner(true)

        await fetch('/api/user/registration/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
          body: JSON.stringify(body)
        })
          .then(async res => {
            setSpinner(false)
            if (res.status === 200) {
              await res.json().then(async data => {
                // Mettez à jour les informations de l'utilisateur
                await updateName(data.firstName, data.lastName)
                toast.success('🎉 Bienvenue ' + data.firstName + ' !')
                await router.push('/')
              })
            } else {
              await res.json().then(data => {
                toast.error('ARRETE ! ARRETE ! ' + data.message + ' !')
              })
            }
          })
          .catch(err => {
            setSpinner(false)
            toast.error('Un problème est survenu. Ré-essayez code: ' + err)
          })
      })
      .catch(function (err) {
        setSpinner(false)
        if (err.name) {
          setError('name', {
            type: 'manual',
            message: err.name
          })
        }
        else if (err.terms) {
          setError('terms', {
            type: 'manual',
            message: err.terms
          })
        }
        else if (err.referral) {
          setError('referralCode', {
            type: 'manual',
            message: err.referralCode
          })
        }
        else if (err.lastName) {
          setError('lastName', {
            type: 'manual',
            message: err.lastName
          })
        }
        else{
          toast.error('Un problème est survenu. Ré-essayez code: ' + err)
        }
      })
  }

  // ** Hook
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (spinner) {
    return <Spinner />
  }

  return (
    <>
    <Head>
      <title>Compléter mon inscription</title>
    </Head>
    <Box className={!hidden ? 'content-center' : 'content-right'}>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={Logo} alt={'Subify'} width={150} loading={'lazy'} />
          </Box>
          <Box sx={{ mb: 8, alignItems: 'center' }}>
            <Typography align='center' variant='h5' sx={{ mb: 2, letterSpacing: '0.18px', fontWeight: 600 }}>
              L'aventure commence ici 🚀
            </Typography>
            <Typography align='center' variant='body2'>
              Encore quelques infos et c'est tout bon !
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    id='name'
                    value={name}
                    label='Prénom'
                    error={Boolean(errors.name)}
                    onChange={nameChange}
                    onInput={e => setName(e.target.value)}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='lastName'
                    value={lastName}
                    label='Nom'
                    error={Boolean(errors.lastName)}
                    onChange={lastnameChange}
                    onInput={e => setLastName(e.target.value)}
                  />
                )}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='referralCode'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='referralCode'
                    value={referralCode}
                    label="Code d'invitation (facultatif)"
                    error={Boolean(errors.referralCode)}
                    onChange={referralCodeChange}
                    onInput={e => setReferralCode(e.target.value)}
                  />
                )}
              />
              {errors.referralCode && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.referralCode.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ my: 0, mb: 4 }} error={Boolean(errors.terms)}>
              <Controller
                name='terms'
                control={control}
                defaultValue={checkBox}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        name='terms'
                        checked={field.value}
                        onChange={checkboxChange}
                        sx={errors.terms ? { color: 'error.main' } : null}
                      />
                    }
                    label={
                      <Fragment>
                        <Typography variant='body2' component='span' sx={{ color: errors.terms ? 'error.main' : '' }}>
                          J'accepte les{' '}
                        </Typography>
                        <Typography
                          href='/'
                          variant='body2'
                          component={Link}
                          target='_blank'
                          sx={{ color: 'primary.main', textDecoration: 'none' }}
                        >
                          Conditions générales d'utilisation 📃
                        </Typography>
                      </Fragment>
                    }
                  />
                )}
              />
              {errors.terms && (
                <FormHelperText sx={{ mt: 0, color: 'error.main' }}>{errors.terms.message}</FormHelperText>
              )}
            </FormControl>
            <Button fullWidth size='large' type='submit' variant='contained'>
              🙌 Terminer mon inscription
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
      </>
  )
}

Complete.getLayout = page => <BlankLayout>{page}</BlankLayout>

Complete.authGuard = false

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)


  if (!session || (session.user.firstname && session.user.lastname)) {
    return {
      redirect: {
        destination: '/'
      }
    }
  }

  const { req, res } = context
  await csrf(req, res)

  return {
    props: {
      csrfToken: req.csrfToken()
    }
  }
}

export default Complete
