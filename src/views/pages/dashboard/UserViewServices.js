// ** Material UI Components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles'
import IconButton from "@mui/material/IconButton";


// ** React Imports
import {useState, useCallback} from 'react'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Custom Table Components Imports
import TableHeader from 'src/views/pages/dashboard/list/TableHeader'

// ** Next Image
import Image from "next/image";
import Grid from "@mui/material/Unstable_Grid2";

// ** Toast
import toast from "react-hot-toast";


const UserViewServices = (props) => {

  const {data, csrf} = props


  // ** State
  const [value, setValue] = useState('');
  const [filteredServices, setFilteredServices] = useState(data);
  const [result, setResult] = useState({});


    // ** Function to handle filter
  const handleFilter = useCallback(val => {
    setValue(val);

    const filtered = data.filter(service =>
      service.serviceName.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [data]);



  const handleServiceClick = async (serviceName) => {

    toast.loading('Accès à '+serviceName+' en cours...', {id: 'loading'})

      try {
      // Envoyer la requête à l'API
      const response = await fetch(`/api/services/${serviceName}/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-token': csrf,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {

          toast.success('Ouverture de '+serviceName+' en cours !', {duration: 7000})


        // Si la réponse est OK, obtenir les données JSON de la réponse
        const data = await response.json();
        setResult(data);

      } else {
        // Gérer les erreurs ici, par exemple :
        setResult({ error: 'Autorisation refusée pour '+serviceName });

      }
    } catch (error) {
      // Gérer les erreurs réseau ici
      setResult({ error: 'Erreur réseau'});

    } finally {

          if(result.error) toast.error(result.error, {duration: 7000})
          toast.dismiss('loading')
    }
  };

    const ServiceBtn = styled(IconButton)(({ theme }) => {

    return {

      size: 'large',
      color: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius
    }
  })


    return (
        <>
      <Grid container spacing={2}>
        <Grid xs={12}>
        <Card>
            <TableHeader value={value} handleFilter={handleFilter} title={'Mes services'}  />
            <CardContent>
                {filteredServices.map((item, index) => (
                    <Box
                        key={item.serviceName}
                        sx={{
                            p: 5,
                            display: 'flex',
                            borderRadius: 1,
                            flexDirection: ['column', 'row'],
                            justifyContent: ['space-between'],
                            alignItems: ['flex-start', 'center'],
                            mb: index !== data.length - 1 ? 4 : undefined,
                            border: theme => `1px solid ${theme.palette.divider}`
                        }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {item.serviceImage && (
                          <ServiceBtn>
                            <Image
                              width="33"
                              height="33"
                              style={{ borderRadius: '6px', width: '100%', height: 'auto' }}
                              alt={item.serviceName + ' logo'}
                              service={item.serviceName}
                              loading={'lazy'}
                              src={item.serviceImage}
                            />
                          </ServiceBtn>
                        )}

                        {item.serviceName && (
                          <Typography  sx={{ fontWeight: 600, marginLeft: 1 }}>
                            {item.serviceName}
                          </Typography>
                        )}
                  <CustomChip
                          skin='light'
                          size='small'
                          label='POPULAIRE'
                          color='primary'
                          sx={{
                            height: 20,
                            ml: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '5px',
                          }}
                        />
                        {item.cardStatus && (
                          <CustomChip
                            skin='light'
                            size='small'
                            label={item.cardStatus}
                            color={item.badgeColor}
                            sx={{
                              height: 20,
                              ml: 2,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: '5px',
                            }}
                          />
                        )}
                      </div>



                      <Box sx={{mt: [3, 0], textAlign: ['start', 'end']}}>
                            <Button variant='contained' sx={{mr: 3}} onClick={() => (handleServiceClick(item.serviceName))}>
                                Accéder au service
                            </Button>
                        </Box>

                    </Box>
                ))}
              {filteredServices.length === 0 ? <div>Pas de service trouvé 😢💀</div> : null}
            </CardContent>


        </Card>
        </Grid>
      </Grid>
  </>
    )
}

export default UserViewServices
