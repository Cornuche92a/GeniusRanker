// api/auth.js

// Packages
import axios from 'axios';
import http from 'http';

// Models
import RankerAccessCookie from 'src/utils/models/rankerfox/cookieaccess.model';
import connectToDatabase from "../../mongodb";
import getIhcLoginNonce from "src/utils/controllers/rankerfox/getIhcLoginNonce";

const getRankerCookies = async () => {
  try {

    const formData = new URLSearchParams();
    formData.append('ihcaction', 'login');
    formData.append('ihc_login_nonce', await getIhcLoginNonce());
    formData.append('rememberme', 'forever');
    formData.append('log', process.env.RANKERFOX_EMAIL);
    formData.append('pwd', process.env.RANKERFOX_PASSWORD);

    const headers = {
      Host: 'rankerfox.com',
      Origin: 'https://rankerfox.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: 'https://rankerfox.com/login/',
    };

    const response = await axios.post('https://rankerfox.com/login/', formData, {
      headers,
      withCredentials: true,
      httpAgent: new http.Agent({ keepAlive: false }),
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400 || status === 302,
    });


    const cookies = response.headers['set-cookie'];

    if(cookies) {  // Si on a bien récupéré des cookies

      // Enregistrement des cookies dans MongoDB

      await connectToDatabase() // On se connecte à MongoDB

      const rankerCookieSchema = new RankerAccessCookie({   // On crée un nouveau document
        cookies: cookies,
      });

      rankerCookieSchema.save(); // On enregistre le document dans la collection RankerAccessCookies

      return cookies;

    }

    return null

  } catch (error) {

    console.error('Authentication failed');

    //throw error;
  }
};

export default getRankerCookies;
