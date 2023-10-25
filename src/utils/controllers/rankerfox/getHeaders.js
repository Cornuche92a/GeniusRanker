import axios from 'axios';
import http from 'http';
import connectToDatabase from "src/utils/mongodb";
import RankerAccessCookie from "src/utils/models/rankerfox/cookieaccess.model";
import getRankerCookies from "src/utils/controllers/rankerfox/getCookies";

// Vérifie si les cookies sont valides en effectuant une requête GET vers la page /my-account/
async function areCookiesValid(cookies) {
  try {


    const response = await axios.get('https://rankerfox.com/my-account/', {
      headers: {
        Host: 'rankerfox.com',
        Origin: 'https://rankerfox.com',
        Referer: 'https://rankerfox.com/login/',
        UserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.63 Safari/537.36',
        Cookie: cookies.join('; ') || null,
      },
      httpAgent: new http.Agent({ keepAlive: false }),
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400 || status === 302,
    });

    console.log('Response status:', response.status);

    return response.status === 200;
  } catch (error) {
    console.error('Error checking cookies:', error);

    return false;
  }
}

// Récupère les cookies de connexion depuis la base de données
async function getRankerCookiesFromDB() {
  try {
    await connectToDatabase(); // Connexion à MongoDB

    const accessCookies = await RankerAccessCookie.findOne({}, {}, { sort: { 'createdAt': -1 } });

    if (accessCookies) {

      //console.log('Cookies retrieved from DB:', accessCookies.cookies);

      return accessCookies.cookies;
    } else {
      console.log('No cookies found in the DB.');

      return [];
    }
  } catch (error) {
    console.error('Error getting cookies from DB:', error);

    return [];
  }
}

// Fonction principale pour générer les en-têtes
async function getHeaders(requestType, host = '') {
  let headers = {
    Host: 'rankerfox.com',
    Origin: 'https://rankerfox.com',
  };

  switch (requestType) {

    case 'getForms':

      const cookies = await getRankerCookiesFromDB();
      const validCookies = await areCookiesValid(cookies);

      if (!validCookies) {

        const newCookies = await getRankerCookies();

        headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.63 Safari/537.36'
        headers.Dnt = '1';
        headers.AcceptEncoding = 'gzip, deflate, br';
        headers.Connection = 'keep-alive';
        headers.Cookie = newCookies.join('; ');

      } else {

        headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.63 Safari/537.36'
        headers.Dnt = '1';
        headers.AcceptEncoding = 'gzip, deflate, br';
        headers.Connection = 'keep-alive';
        headers.Cookie = cookies.join('; ');

      }

        break;


    case 'logIn':

      headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.63 Safari/537.36'
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers.Referer = 'https://rankerfox.com/login/';

        break;

    case 'accessToService':

      headers.Host = host;
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers.Referer = 'https://rankerfox.com/';
      headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.63 Safari/537.36'
      headers.Connection = 'close';

        break;

  }

  return headers;
}

export default getHeaders;
