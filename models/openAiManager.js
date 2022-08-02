
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios'); //add this line at the top


class OpenAiManager {
  
  configuration;
  openai;
  
  constructor(){
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    console.log('OpenAI manager instanced');
  }

  async requestCompletion(prompt){
    const url = process.env.OPENAI_COMPLETION_URL;
    console.log('URL is: ' + url);
    console.log('Prompt is: ' + prompt);
    
    let payload = {
      "model": "text-davinci-002", 
      "prompt": prompt, 
      "temperature": 0.75, 
      "max_tokens": 256
    };

    let headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    };

    //let res = await axios.post(url, payload);
    let res = await axios.post(url, payload, {headers: headers});
    let data = res.data;
    console.log(data);
    console.log(data.choices[0].text);
    return data.choices[0].text;
  }

}

module.exports = new OpenAiManager();

