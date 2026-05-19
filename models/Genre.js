const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name:{type: String},
}, { timestamps: true, collection: 'genresLIB' });

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;