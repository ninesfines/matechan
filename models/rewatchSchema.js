const mongoose = require('mongoose');

const user = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userId: {type: String}
})

const rewatchSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    code: {type: String, unique: true},
    description: {type: String},
    animeId: {type: Number, require: true},
    animeTitle: {type: String},
    animePicture: {type: String},
    users: [user]
})

const model = mongoose.model("rewatchmodels", rewatchSchema);

module.exports = model;