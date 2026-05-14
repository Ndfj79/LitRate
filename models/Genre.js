const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    _id:{type: String, required: true, unique: true},
    name:{type: String},
}, { timestamps: true, collection: 'genresLIB' });

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;