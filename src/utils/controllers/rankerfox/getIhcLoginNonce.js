const axios = require('axios');
const cheerio = require('cheerio');

const getIhcLoginNonce = async () => {
  try {
    const response = await axios.get('https://rankerfox.com/login/');

    // Load the HTML content of the response into Cheerio
    const $ = cheerio.load(response.data);

    // Extract the ihc_login_nonce value from the HTML
    return $('[name="ihc_login_nonce"]').val();

  } catch (error) {
    console.error('Error retrieving ihc_login_nonce', error);
    throw error;
  }
};


export default getIhcLoginNonce;

