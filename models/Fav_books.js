const mongoose = require('mongoose');

const Fav_booksSchema = new mongoose.Schema({
    user_id: {type: Number, required: true, unique:true},
    us_books: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
}, { timestamps: true , collection: 'fav_books' });

const Fav_books = mongoose.model('Fav_books', Fav_booksSchema);

module.exports = Fav_books;