const express = require("express");
const router = express.Router();
const session = require('express-session');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Cover = require('../models/Cover');
const User = require('../models/user');
const Rate = require('../models/Rate');
const Genre = require('../models/Genre');
const {verifyToken} = require('../controllers/isAuth');
const {reduceAuthors} = require('../controllers/reduceAuthors');



router.get("/", verifyToken, async (req, res) => {
    if (req.user == "No-user"){
        var isUser = false;
        var newBooks = await Book.find({}).sort({year: 1}).limit(5).populate('author_ids').populate('cover_id');
        var books = await Book.find({}).limit(5).sort({rate_count: 1}).populate('author_ids').populate('cover_id');  

        newBooks = reduceAuthors(newBooks);
        books = reduceAuthors(books);
        res.render("../views/index.hbs", 
        {
            newBooks: newBooks,
            genreBooks: books,
            authorBooks: books, 
        });
    }
    else
    {
        var isUser = true;
        const user = await User.findOne({mail: req.cookies.mail});
        const userRates = await Rate.find({user_id: user._id});

        var commentedBooks = [];
        for (let i = 0; i < userRates.length; i++){
            commentedBooks.push(await Book.findOne({_id: userRates[i].book_id}).populate('genre_ids'));    
        }
        var genres = [];
        for (let i = 0; i < commentedBooks.length; i++){
            genres.push(commentedBooks[i].genre_ids[0]._id);
        }

        var recBooksAuthor = await Book.find({author_ids: commentedBooks[0].author_ids}).populate('cover_id').populate('author_ids').limit(5);

        var recBooksAuthor = [];
        for (let i=0; i<commentedBooks.length; i++){
            recBooksAuthor.push( await Book.findOne({author_ids: commentedBooks[i].author_ids}).populate('cover_id').populate('author_ids'));
        }

        for (let i=0; i<commentedBooks.length; i++){
            commentedBooks[i] = commentedBooks[i]._id;
        }

        var newBooks = await Book.find({}).sort({year: 1}).limit(5).populate('author_ids').populate('cover_id');
        var recBooksGenre = await Book.find({genre_ids: genres, _id: {$nin : commentedBooks}}).populate('genre_ids').populate('cover_id').populate('author_ids').limit(5);  

        recBooksGenre = reduceAuthors(recBooksGenre);
        recBooksAuthor = reduceAuthors(recBooksAuthor);
        newBooks = reduceAuthors(newBooks);

        res.render("../views/index.hbs", 
            {
            newBooks: newBooks,
            genreBooks: recBooksGenre,
            authorBooks: recBooksAuthor, 
            isUser: isUser,
            user: user
        });
    }
});

module.exports = router;

