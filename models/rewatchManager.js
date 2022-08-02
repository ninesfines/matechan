const Rewatch = require('./rewatch.js');
const RewatchMD = require('./rewatchSchema.js');
const axios = require('axios'); //add this line at the top
const mongoose = require("mongoose");

class RewatchManager {
    rewatchList;

    constructor(){
        this.rewatchList = [];
        console.log('Rewatch manager instanced');
    }

    async createRewatch(animeId, rewatchCode){
        const rewatch = new Rewatch(animeId, rewatchCode);
        const anime = await getAnime(animeId);
        rewatch.description = anime.title + ' rewatch';
        rewatch.animeTitle = anime.title;
        rewatch.animePicture = anime.main_picture.large;
        await this.saveRewatch(rewatch);
        return rewatch;
    }

    async saveRewatch(rewatch){
      const rewatchMD = new RewatchMD({
        _id: mongoose.Types.ObjectId(),
        code: rewatch.code,
        description: rewatch.description,
        animeId: rewatch.animeId,
        animeTitle: rewatch.animeTitle,
        animePicture: rewatch.animePicture
      });
      await rewatchMD.save();
    }

    async loadRewatchCodes(){
      const rewatchModel = mongoose.model("rewatchmodels", RewatchMD.rewatchSchema);
      const rewatchCodes = await rewatchModel.find({}).select({"code": 1, "animeTitle": 1});
      return rewatchCodes;
    }

    async addUser(rewatchCode, userId){
      const rewatchModel = mongoose.model("rewatchmodels", RewatchMD.rewatchSchema);
      const rewatchUsers = await this.getRewatchUsers(rewatchCode);

      console.log(rewatchUsers)

      if(this.userIsAlreadyOnRewatch(userId, rewatchUsers)){
        console.log('User already on rewatch');
        throw new Error('user_already_on_rewatch');
      }
      else{
        console.log('User is not on the rewatch');
        anime = await this.getRewatchAnime(rewatchCode);
        character = await this.getRandomCharacter(anime.animeId);
        const userIdStruct = {
          userId: userId,
          characterName: character.name,
          characterPicture: character.images.jpg.image_url
        };
        await rewatchModel.findOneAndUpdate({"code": rewatchCode}, { $push: { users: userIdStruct}});
        return userIdStruct;
      }
    }

    async getRewatchUsers(rewatchCode){
      const rewatchModel = mongoose.model("rewatchmodels", RewatchMD.rewatchSchema);
      const rewatch = await rewatchModel
        .find({ code: rewatchCode })
        .select({"animeTitle": 1, "users": 1});
      console.log('Rewatch is: ' + rewatchCode + ' ' + rewatch);
      return rewatch[0].users;
    }

    async getRandomCharacter(animeId){
      const characters = await getCharacters(animeId);
      const numberOfCharacters = Object.keys(characters).length;
      const randIndex = Math.round(Math.random() * numberOfCharacters);
      return characters[randIndex].character;
    }

    userIsAlreadyOnRewatch(newRewatcher, usersList){
      var userIsOnRewatch = false;
      console.log(Array.from(usersList));
      Array.from(usersList).forEach(userOnRewatch => {
        var i = 1;
        console.log(i++ + ' ' + userOnRewatch);
        if(newRewatcher === userOnRewatch.userId)
          userIsOnRewatch = true;
      });
      return userIsOnRewatch;
    }

    async getRewatchAnime(rewatchCode){
      const rewatchModel = mongoose.model("rewatchmodels", RewatchMD.rewatchSchema);
      const anime = await rewatchModel
        .find({ code: rewatchCode })
        .select({"animeId": 1, "animeTitle": 1, "animePicture": 1});
      return anime[0];
    }

    async test(){
      //await this.getCharacter(160);
    }
}

//returns the main info of the searched anime
async function getAnime(id){
    const url = process.env.GET_ANIME_URL + id;
    console.log('URL es:' + url);
    res = await axios.get(url, {headers: {
      'X-MAL-CLIENT-ID': (process.env.MAL_CLIENT_ID)
    }})
    //console.log(res);
    return res.data;
}

//returns a rondom character of an anime from MAL
async function getCharacters(animeId){
    const url = (process.env.GET_CHARACTER_URL).replace('#animeId#', animeId);
    console.log('URL: ' + url);
    response = await axios.get(url);
    if(response.status == 200)
      return response.data.data;
    else
      throw new Error('Could not connect with MAL webservice');
}

module.exports = new RewatchManager();