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

  if (!msg.content.startsWith(process.env.COMMAND_PREFIX)) return; // If the message doesn't start with the prefix return

  const args = msg.content.slice(1).split(' '); // Split all spaces so you can get the command out of the message
  const cmd = args.shift().toLowerCase(); // Get the commands name
  
  switch (cmd) {
    case "vivo?": case "vivo":
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
      var animeId = args[0];
      var rewatchCode = args[1];
      if(animeId === null || isNaN(animeId)) 
        msg.channel.send(process.env.ADDREWATCH_PARAMETER_MAL_ID);
      if(typeof rewatchCode != 'string' || rewatchCode.length < process.env.REWATCH_CODE_MIN_LENGTH)
        msg.channel.send(process.env.ADDREWATCH_PARAMETER_CODE_REWATCH);
      else {
          await rewatchManager.createRewatch(animeId, rewatchCode)
          .then(rewatch => {
            console.log('Creado: ' + rewatch);
            msg.channel.send('Creado: ' + rewatch);
          })
          .catch(err => {
            console.error(err);
            console.log(typeof err.code);
            console.log(typeof err.response);
            if(typeof err.code != 'undefined' && err.code === 11000)
              msg.channel.send(process.env.DUPLICATE_REWATCH_CODE_ERROR);
            else if(typeof err.response != 'undefined' 
                && typeof err.response.status != 'undefined' 
                && err.response.status === 404)
              msg.channel.send(process.env.MAL_ID_NOT_FOUND_ERROR);
            else  
              msg.channel.send(process.env.GENERAL_REWATCH_ERROR);
          });
      }
      break;
    case "listrewatches":
      var rewatchCodes = await rewatchManager.loadRewatchCodes();
      console.log(rewatchCodes);
      rewatchCodes.forEach(rewatch => {
        msg.channel.send(rewatch.code + ' | ' + rewatch.animeTitle);
      });
      break;
    case "adduser":
      var rewatchCode = args[1];
      var userId = msg.mentions.users.first().id;
      if(typeof rewatchCode != 'string'  
        || rewatchCode.length < process.env.REWATCH_CODE_MIN_LENGTH
        || userId === null) 
        msg.channel.send(process.env.ADDUSER_INVALID_PARAMETERS);
      await rewatchManager.addUser(rewatchCode, userId)
        .then(result => {
          msg.channel.send(process.env.ADDREWATCH_USER_ADDED);
        })
        .catch(err => {
          if(err.message === 'user_already_on_rewatch')
            msg.channel.send(process.env.ADDREWATCH_USER_ALREADY_ON_REWATCH);
        });
      break;

    case "test":
      //msg.channel.send("test");
      await rewatchManager.getRandomCharacter(160)
      .then(character => {
        console.log('Character is: ' + character.name);
        msg.channel.send(character.name + '\n' + character.images.jpg.image_url);
      })
      .catch(err => {
        console.error(err);
      })
      
      break;
   }
});

mongoose.connect(process.env.MONGODB_SRV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true
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