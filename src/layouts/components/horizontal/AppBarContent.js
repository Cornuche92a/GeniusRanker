// ** MUI Imports
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import {Stack} from "@mui/material";

// ** Next Auth
import {signIn, useSession} from 'next-auth/react'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/layouts/components/UserDropdown'

const AppBarContent = props => {

  // ** Props
  const { settings, saveSettings } = props
  const {data: session, status} = useSession()

  // ** On loading
  if(status === 'loading') {
    return (
      <Stack sx={{ width: '15%'}}>
        <LinearProgress color='info' />
      </Stack>

    )
  }

  // ** If user is unauthenticated
  if(status === 'unauthenticated'){
    return (

      <Box sx={{ display: 'flex', alignItems:'center', mr: 1, justifyContent:'space-between'}}>

        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <Button variant='contained' size='medium' onClick={() => signIn('auth0',  { screen_hint: 'signup'  })}>
          MON COMPTE
        </Button>
      </Box>


    )
  }

  // ** If user is authenticated
  if (status === 'authenticated' && session) {
    return (
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <ModeToggler settings={settings} saveSettings={saveSettings}/>
        <UserDropdown data={session.user} settings={settings}/>
      </Box>
    )
  }
}

export default AppBarContent
