const { Client } = require('discord.js');
const axios = require('axios'); //add this line at the top
const mongoose = require("mongoose");
const Rewatch = require('./models/rewatch.js');
const RewatchManager = require('./models/rewatchManager.js');
const RewatchMD = require('./models/rewatchSchema.js');
const fetch = require('node-fetch');
const API = require("@chris-kode/myanimelist-api-v2");
require('dotenv').config(); //initialize dotenv


const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
});

const messages = [];
const rewatchManager = RewatchManager;

client.once('ready', () => console.log('Ready!'));

client.on('messageCreate', async (msg) => {

  if (!msg.content.startsWith('+')) return; // If the message doesn't start with the prefix return

  const args = msg.content.slice(1).split(' '); // Split all spaces so you can get the command out of the message
  const cmd = args.shift().toLowerCase(); // Get the commands name
  
  switch (cmd) {
    case "vivo?":
      msg.reply("sobreviviendo");
      break;
    //our meme command below
    case "add":    
      message = new Message(args.join(' '), msg.author.id);
      messages.push(message);
      //messages.push(args.join(' ')); // Add the message's content to the messages array
      console.log('Saved: ' + message);
      msg.channel.send('Saved ' + message);
      break;
    case "getmessages":
      console.log(messages);
      //msg.channel.send(messages.map((message) => `${message}\n`)); /* Get all the stored messages and map them + send them */
      messages.forEach(m => {
        console.log(m);
        msg.channel.send(m.toString());
      });
      break;
    case "addrewatch":
      const animeId = args[0];
      const rewatchCode = args[1];
      if(animeId === null || isNaN(animeId)) 
        msg.channel.send('Ingresar ID de MAL');
      else {
        const rewatch = await rewatchManager.createRewatch(animeId, rewatchCode);
        msg.channel.send('Creado: ' + rewatch);
      }
      break;
    case "listrewatches":
      const rewatchCodes = await rewatchManager.loadRewatchCodes();
      console.log(rewatchCodes);
      rewatchCodes.forEach(rewatch => {
        msg.channel.send(rewatch.code + ' | ' + rewatch.animeTitle);
      });
      
      break;
   }
});

async function getAnime(id){
  const url = 'https://api.myanimelist.net/v2/anime/' + id;
  console.log('URL es:' + url);
  res = await axios.get(url, {headers: {
    'X-MAL-CLIENT-ID': (process.env.MAL_CLIENT_ID)
  }});
  console.log(res.data);
  return res.data;
}

mongoose.connect(process.env.MONGODB_SRV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database!')
}).catch((err) => {
  console.log(err);
});

client.login(process.env.CLIENT_TOKEN);

class Message {
  message;
  userId;

  constructor(message, userId){
    this.message = message;
    this.userId = userId;
  }

  getMessage(){
    return this.message;
  }

  getUserId(){
    return this.userId;
  }

  //toString(){
    //return this.message + ' ' + this.userId;
  //}
}



Message.prototype.toString = function msgToString() {
  //username = client.users.cache.find(user => user.id === 'USER-ID').getUsername;
  username = client.users.cache.get(this.userId).username;
  return this.message + ' from user ' + username;
  //return this.message;
}