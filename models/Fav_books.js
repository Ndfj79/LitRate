const mongoose = require('mongoose');

const Fav_booksSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    books: [{type:String}]
}, { timestamps: true });

const Fav_books = mongoose.model('Fav_books', Fav_booksSchema);

module.exports = Fav_books;