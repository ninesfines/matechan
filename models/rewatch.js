

class Rewatch {
    code;
    description;
    animeId;
    animeTitle;
    animePicture;
    users;

    constructor(animeId, code){
        this.animeId = animeId;
        if(code != null)
            this.code = code;
        this.users = [];
    }

    getDescription(){
        return this.description;
    }

    getAnimeId(){
        return this.animeId;
    }
}

Rewatch.prototype.toString = function msgToString() {
    return this.description + '\n' + this.animePicture;
}


module.exports = Rewatch;