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
        //this.rewatchList.push(rewatch);
        await this.saveRewatch(rewatch);
        //console.log('Save result: ' + saveResult)
        return rewatch;
    }

    async saveRewatch(rewatch){
      var saveResult;  
      const rewatchMD = new RewatchMD({
        _id: mongoose.Types.ObjectId(),
        code: rewatch.code,
        description: rewatch.description,
        animeId: rewatch.animeId,
        animeTitle: rewatch.animeTitle,
        animePicture: rewatch.animePicture
      });
      await rewatchMD.save();
        // .then(result => {
        //   //console.log('Success: ' + result);
        //   return 'Success';
        // })
        // .catch(err => {
        //   console.log('Error: ' + err); 
        //   if(err.name === 'MongoServerError' && err.code === 11000){
        //     console.log('Error duplicado');
        //     throw new Error('Duplicate');
        //     //return 'Duplicate';
        //   }else
        //     return 'Error'
        // });
      //console.log('Result: ' + saveResult);
      //return saveResult
    }

    async loadRewatchCodes(){
      const rewatchModel = mongoose.model("rewatchmodels", RewatchMD.rewatchSchema);
        
      const rewatchCodes = await rewatchModel.find({}).select({"code": 1, "animeTitle": 1});
        //console.log(rewatchCodes);
        // await rewatchCodes.forEach(doc => {
        //     console.log(doc)
        // });
      return rewatchCodes;
    }

    async addUser(rewatchCode, userId){
      const rewatchModel = mongoose.model("rewatchmodels", RewatchMD.rewatchSchema);
      const userIdStruct = {userId: userId};
      const rewatch = await rewatchModel.findOneAndUpdate({"code": rewatchCode}, { $push: { users: userIdStruct}});
      // console.log(rewatch);
      // await rewatchModel.updateOne(
      //   { _id: rewatch._id},
      //   //{ $push: { users: userIdStruct}}
      //   { animeTitle: "test" }
      // );
    }
}

async function getAnime(id){
    const url = process.env.GET_ANIME_URL + id;
    console.log('URL es:' + url);
    res = await axios.get(url, {headers: {
      'X-MAL-CLIENT-ID': (process.env.MAL_CLIENT_ID)
    }});
    //console.log(res.data);
    return res.data;
}


module.exports = new RewatchManager();