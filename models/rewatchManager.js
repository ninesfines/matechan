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
        this.rewatchList.push(rewatch);
        this.saveRewatch(rewatch);
        return rewatch;
    }

    saveRewatch(rewatch){
        const rewatchMD = new RewatchMD({
          _id: mongoose.Types.ObjectId(),
          code: rewatch.code,
          description: rewatch.description,
          animeId: rewatch.animeId,
          animeTitle: rewatch.animeTitle,
          animePicture: rewatch.animePicture
        });
        rewatchMD.save()
          .then(result => console.log(result))
          .catch(err => console.log(err));
        console.log('Saved to database: ' + rewatchMD.description);
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