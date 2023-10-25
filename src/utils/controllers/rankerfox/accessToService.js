const https = require('https');
const querystring = require('querystring');

function envoyerRequete(inputData) {
    const postData = querystring.stringify(inputData);

    const options = {
        hostname: 'seod.kratosserver.click',
        port: 443,
        path: '/authorize',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'Content-Length': postData.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

// Exemple d'utilisation
const inputData = {
    sess: 'RvjlTDi5TMbag+ymiD3b1ovHTq8=#JbEJZQ==#Wzg4Nywid29yZHByZXNzX2xvZ2dlZF9pbl83OTIzOTRkMDRlYzQ5MWMxMzU1YTQxM2E4OWIzZWIxND1BcnRodXVyU0VPfDE2OTU1OTY1MDR8aEdzMUN2YWRjaVlmQVB1Sm83a2VXVTVUZVNxcW1ObXIwOTBVWWhNRXBCZHw3ZTQ4YTBlOWIwZWZmZjU2YjYxYTAzYjMzNWRiYTJhY2FlMTdhNjE0NmVkMTEyNmVmZTNkOTI3NGFmNTAyMmJiIiwiMTY0NjNmZjQxMiIsMF0=',
    site: 'https://rankerfox.com'
};

envoyerRequete(inputData)
    .then((reponse) => {
        console.log(reponse);
    })
    .catch((erreur) => {
        console.error(erreur);
    });
