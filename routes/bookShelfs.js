const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Bookshelf = require("../models/BooksShelf");



router.get("/", async (req, res) => {
    var isUser;
    var isPost = false;
    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelves = await Bookshelf.find({}).sort({like_count: -1}).populate('user_id').limit(7);
    if (req.cookies.mail){
        isUser = true;
        for (let i=0; i<bookshelves.length; i++){
            if (bookshelves[i].liked_users.includes(user._id)){
                bookshelves[i].isLiked = true;
            }
            else{
                bookshelves[i].isLiked = false;
            }
        }
    }
    else{isUser = false;}
    res.render("../views/bookshelves.hbs", {isUser: isUser, user:user, bookshelves: bookshelves, isPost: isPost});

});


router.post("/", async (req, res) => {
    var isUser;
    var isPost = true;
    const user = await User.findOne({mail: req.cookies.mail});
    const { searchText } = req.body;

    var bookshelves = await Bookshelf.find({shelfname: { $regex: searchText, $options: 'i' }}).sort({like_count: -1}).populate('user_id');
    console.log(bookshelves);

    if (req.cookies.mail){
        isUser = true;
        for (let i=0; i<bookshelves.length; i++){
            if (bookshelves[i].liked_users.includes(user._id)){
                bookshelves[i].isLiked = true;
            }
            else{
                bookshelves[i].isLiked = false;
            }
        }
    }
    else{isUser = false;}


    res.render("../views/bookshelves.hbs", {isUser: isUser, user:user, bookshelves: bookshelves, isPost: isPost});

});


router.get("/like", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});

    var bookshelf = await Bookshelf.findOne({_id: id});
    bookshelf.like_count += 1;
    bookshelf.liked_users.push(user._id);

    bookshelf.save()
    res.redirect("/bookshelves");
}); 


router.get("/unlike", async (req, res) => {
    var id = req.query.id;
    const user = await User.findOne({mail: req.cookies.mail});

    var bookshelf = await Bookshelf.findOne({_id: id});
    bookshelf.like_count -= 1;
    const index = bookshelf.liked_users.indexOf(user._id);
    bookshelf.liked_users.splice(index, 1);

    bookshelf.save()
    res.redirect("/bookshelves");
}); 

module.exports = router