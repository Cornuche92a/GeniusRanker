// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinearProgress from "@mui/material/LinearProgress";

// ** Next Auth
import { signIn, useSession } from 'next-auth/react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/layouts/components/UserDropdown'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Next Auth
  const {data: session, status} = useSession()

  // ** On loading auth state
  if(status === 'loading') {
    return (
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box className='actions-left' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>

        </Box>
        <Box className='actions-right' sx={{display: 'flex', alignItems: 'center'}}>
          <LinearProgress color='info' />
        </Box>
      </Box>
    )
  }

  // ** If user is unauthenticated
  if(status === 'unauthenticated' || !session) {
    return (
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box className='actions-left' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
          <IconButton color='inherit' sx={{ml: -2.75}} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu'/>
          </IconButton>
        </Box>
        <Box className='actions-right' sx={{display: 'flex', alignItems: 'center'}}>
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={() => signIn('auth0')}>
            <Icon icon='mdi:login' />
          </IconButton>
        </Box>
        </Box>
    )
  }

  // ** If user is authenticated
  if (status === 'authenticated' && session) {
    return (
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box className='actions-right' sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
          <UserDropdown data={session.user} settings={settings}/>

        </Box>
        <Box className='actions-left' sx={{display: 'flex', alignItems: 'center'}}>
          <ModeToggler settings={settings} saveSettings={saveSettings}/>

          {hidden ? (
            <IconButton color='inherit' sx={{ml: -2.75}} onClick={toggleNavVisibility}>
              <Icon icon='mdi:menu'/>
            </IconButton>
          ) : null}
        </Box>
      </Box>
    )
  }
}

export default AppBarContent

