let mongoose = require('mongoose')

let PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    subregion: {
        type: String,
        required: true,
    },
    continent: {
        type: String,
        required: true,
    },
    catagories: {
        type: Array,
    },
},{timestamps: true})

module.exports = mongoose.model("Post", PostSchema)