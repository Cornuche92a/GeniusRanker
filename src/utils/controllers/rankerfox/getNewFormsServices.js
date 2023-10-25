//
import axios from 'axios';
import http from 'http';

//
import getHeaders from "src/utils/controllers/rankerfox/getHeaders";
import RankerServices from "src/utils/models/rankerfox/services.model";
import connectToDatabase from "src/utils/mongodb";

//
import cheerio from "cheerio";


const getNewFormsServices = async () => {
  try {

    const headers = await getHeaders('getForms');

    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.63 Safari/537.36'

    // Fetch the forms
      const response = await axios.get('https://rankerfox.com/premium-plan/', {
        headers,
        withCredentials: true,
        httpAgent: new http.Agent({keepAlive: false}),
        validateStatus: (status) => status >= 200 && status < 400 || status === 302,
      }).then((response) => {
        if (response.status === 200) {
          console.log('Voici la réponse : ' + response.status)

          return response.data;

        }
        else {

          console.log('Erreur : ' + response.status)

          return null;
        }
      });


    // Parse the response and extract the forms
     const forms = await parseFormsFromResponse(response);

    // Connect to MongoDB

    await connectToDatabase();

    // Mise à jour des enregistrements existants
    for (const form of forms) {
      const existingService = await RankerServices.findOneAndUpdate(
          { _id: form._id },
          {
            rankerInfos: form.rankerInfos,
            serviceData: form.serviceData,
            serviceOptions: form.serviceOptions,
          },
          { new: true }
      );

      if (!existingService) {
        await RankerServices.insertMany([form]);
      }
    }

    return forms;

  } catch (error) {
    console.error('Error fetching and saving forms:', error);

  }
};




async function parseFormsFromResponse(html) {
  const parsedForms = [];

  const $ = cheerio.load(html);



  $('div.elementor-element[data-widget_type="profile-card-elementor-widget.default"]').each((index, element) => {
    const dataId = $(element).attr('data-id');
    const serviceInfo = $(element).find('.team-member-info');
    const serviceName = serviceInfo.find('form input[type="submit"]').attr('value');
    const image = $(element).find('.team-member-profile img').attr('src');

    const forms = serviceInfo.find('form');

    const serviceData = {
      action: forms.first().attr('action'),
      tokens: {},
    };
    forms.first().find('input[type="hidden"]').each((idx, input) => {
      const name = $(input).attr('name');
      const value = $(input).attr('value');

      // Vérifier si le nom du token existe déjà
      if (!serviceData.tokens[name]) {
        serviceData.tokens[name] = value;
      }
    });


    let serviceOptions = [];

    // Only add forms to serviceOptions if there are multiple forms present
    if (forms.length > 1) {
      forms.slice(1).each((idx, form) => {
        const option = {
          action: $(form).attr('action'),
          tokens: {},
        };
        $(form).find('input[type="hidden"]').each((idx, input) => {
          const name = $(input).attr('name');
          const value = $(input).attr('value');
          option.tokens[name] = value;
        });
        serviceOptions.push(option);
      });
    }

    if (dataId && serviceName && image) {
      parsedForms.push({
        _id: dataId,
        rankerInfos: {
          serviceName: serviceName,
          serviceImage: image,
        },
        serviceName: serviceName,
        serviceImage: "https://rankgeniuspublic.s3.eu-west-3.amazonaws.com/services/"+serviceName+".png",
        serviceData: serviceData,
        serviceOptions: serviceOptions,
      });
    }
  });

  return parsedForms;
}


















export default getNewFormsServices;
