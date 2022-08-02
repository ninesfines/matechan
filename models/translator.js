const axios = require('axios'); 

class Translator {

    constructor(){
        console.log('Translator instanced');
    }

    async translate(text, targetLanguage, sourceLanguage){

        const encodedParams = new URLSearchParams();
        encodedParams.append("q", text);
        encodedParams.append("target", targetLanguage);
        encodedParams.append("source", sourceLanguage);
        // encodedParams.append("target", "es");
        // encodedParams.append("source", "en");

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': '1ff487f939msh4e35141cb6d316ep12039djsn567f0b1f7565',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: encodedParams
        };

        axios.request(options).then(function (response) {
            const translation = response.data.data.translations[0].translatedText;
            console.log('La traduccion es: ' + translation);
            return translation;
        }).catch(function (error) {
            console.error(error);
        });

    }

}

module.exports = new Translator();