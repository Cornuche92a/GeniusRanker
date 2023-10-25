// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {Fragment} from "react";
import CardHeader from "@mui/material/CardHeader";

const TableHeader = props => {
  // ** Props
  const { handleFilter,  value, title } = props



    return (
      <Fragment>
        <CardHeader  title={title} />

        <Box sx={{  pl: 5, pr:2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>

          <TextField
            size='small'

            value={value}
            sx={{ mr: 3, mb: 1, width: '30%'}}
            placeholder='Rechercher un service'
            onChange={e => handleFilter(e.target.value)}
          />

      <Box sx={{  pb: 1, p: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant='outlined' color={'error'} onClick={() => null} sx={{'& svg': {mr: 1}}}>

          <Icon icon='mdi:alert' fontSize='1.125rem'/>
          Signaler
        </Button>
      </Box>
    </Box>
      </Fragment>
  )
}

export default TableHeader
