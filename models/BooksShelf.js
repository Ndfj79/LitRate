const mongoose = require('mongoose');

const BooksShelfSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    liked_users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    shelf_books: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
    shelfname:{type: String,sparse: true},
    like_count: {type: Number,sparse: true},
    isLiked: {type: Boolean}
}, { timestamps: true , collection: 'BooksShelf' });

const BooksShelf = mongoose.model('BooksShelf', BooksShelfSchema);

module.exports = BooksShelf;