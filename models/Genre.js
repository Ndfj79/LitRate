const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    key:{type: String, required: true, unique: true},
    name:{type: String},
}, { timestamps: true, collection: 'genresLIB' });

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;