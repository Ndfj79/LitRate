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
        var books = await Book.find({}).limit(5).populate('author_ids').populate('cover_id');  
        
        var popularBooks = await Book.find({}).sort({rate_count: -1}).limit(5).populate('author_ids').populate('cover_id'); 

        newBooks = reduceAuthors(newBooks);
        books = reduceAuthors(books);
        res.render("../views/index.hbs", 
        {
            newBooks: newBooks,
            genreBooks: books,
            authorBooks: popularBooks, 
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
        var commentedIds = [];
        for (let i=0; i<commentedBooks.length; i++){
            commentedIds.push(commentedBooks[i]._id);
        }

        var recBooksAuthor = [];
            for (let i=0; i<commentedBooks.length; i++){
                if (await Book.findOne({author_ids: {$in: commentedBooks[i].author_ids}, _id: {$nin: commentedIds}}) != null){
                    recBooksAuthor.push(await Book.findOne({author_ids: {$in: commentedBooks[i].author_ids}, _id: {$nin: commentedIds}}).populate('cover_id').populate('author_ids'));
                }
        }
        

        for (let i=0; i<commentedBooks.length; i++){
            commentedBooks[i] = commentedBooks[i]._id;
        }

        var newBooks = await Book.find({}).sort({year: 1}).limit(5).populate('author_ids').populate('cover_id');
        var recBooksGenre = await Book.find({genre_ids: {$in: genres}, _id: {$nin : commentedBooks}}).populate('cover_id').populate('author_ids').limit(5);  
        var isCommentedBooks = false;
        var isAuthorBooks = false;
        if (commentedBooks.length != 0 && recBooksAuthor[0] != null){
            isCommentedBooks = true;
            isAuthorBooks = true;   
            recBooksGenre = reduceAuthors(recBooksGenre);
            recBooksAuthor = reduceAuthors(recBooksAuthor);
        }
        console.log(isCommentedBooks, isAuthorBooks);
        newBooks = reduceAuthors(newBooks);

        res.render("../views/index.hbs", 
            {
            newBooks: newBooks,
            genreBooks: recBooksGenre,
            authorBooks: recBooksAuthor, 
            isUser: isUser,
            user: user,
            isCommentedBooks: isCommentedBooks,
            isAuthorBooks: isAuthorBooks
        });
    }
});

module.exports = router;

