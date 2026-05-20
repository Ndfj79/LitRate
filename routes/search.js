const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const {reduceAuthors} = require('../controllers/reduceAuthors');
const User = require('../models/user');


router.post("/", async (req, res) => {
    try{
        const { searchText } = req.body;
        
        var isComplete = true;
        var isUser;
        const user = await User.findOne({mail: req.cookies.mail});
        if (req.user == "No-user"){
            isUser = false;
        }
        else{
            isUser = true;
        }
        
        var books = await Book.find({title: { $regex: searchText, $options: 'i' }}).populate('author_ids').populate('cover_id').populate('genre_ids');
        var booksISBN = await Book.find({isbn: searchText}).populate('author_ids').populate('cover_id').populate('genre_ids');
        books = reduceAuthors(books);
        booksISBN = reduceAuthors(booksISBN);
        books = books.concat(booksISBN);
        if (books == []){
            console.log(books);

            isComplete = false;
            res.render("../views/search.hbs", {isComplete: isComplete});
        }

        res.render("../views/search.hbs", {books:books, user:user, isUser:isUser, isComplete:isComplete});

    }
    catch(err){
        var isComplete = false;
        res.render("../views/search.hbs", {isComplete: isComplete});

    }
    
});

module.exports = router;

