const deepl = require('deepl-node');

class DeepLManager{

    translator;

    constructor(){
        console.log(process.env.DEEPL_API_KEY);
        this.translator = new deepl.Translator("279a2e9d-83b3-c416-7e2d-f721593e42a0:fx");
        console.log('DeepL manager instanced');
    }

    async translatEnglishToSpanish(text){
        let res = await this.translator.translateText(text, 'en', 'es');
        console.log(res);
        //return res.translations[0].text;
    }
}

module.exports = new DeepLManager();