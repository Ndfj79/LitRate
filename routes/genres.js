const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const Cover = require('../models/Cover');
const Genre = require("../models/Genre");
const User = require("../models/user");
const { reduceAuthors } = require("../controllers/reduceAuthors");

router.get("/", async (req, res) => {
    var isUser;
    const user = await User.findOne({mail: req.cookies.mail});
    if (req.cookies.mail){
        isUser = true;
    }
    else{
        isUser = false;
    }
    res.render("../views/genres.hbs", {isUser: isUser, user:user});

});


router.post("/", async (req, res) => {
    var isUser;
    var isPost = true;
    const user = await User.findOne({mail: req.cookies.mail});
    if (req.cookies.mail){
        isUser = true;
    }
    else{
        isUser = false;
    }
    const { searchText } = req.body;

    try{
        var genres = await Genre.find({name: { $regex: searchText, $options: 'i' }})
        var books = await Book.find({genre_ids: genres[0]._id}).populate('cover_id').populate('author_ids').populate('genre_ids');
        books = reduceAuthors(books);

        res.render("../views/genres.hbs", {isUser:isUser, isPost: isPost, user:user, books:books});
    }catch{
        res.render("../views/genres.hbs", {isUser:isUser, isPost: isPost, user:user});
    }

    
});

module.exports = router