const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Bookshelf = require("../models/BooksShelf");
const Rate = require("../models/Rate");
const Book = require("../models/Book");


router.get("/", async (req, res) => {
    var isUser;
    const user = await User.findOne({mail: req.cookies.mail});
    
    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    var rates = await Rate.find({user_id: user._id});
    var ratedCount = rates.length;

    var middleRate = 0;
    var likes = 0;
    for (let i=0; i<rates.length; i++){
        middleRate += rates[i].rate;
        likes += rates[i].like_count;
    }
    middleRate /= rates.length;
    middleRate = middleRate.toFixed(1);




    res.render("../views/profile.hbs", {isUser:isUser, user:user, ratedCount: ratedCount, middleRate: middleRate, likes: likes});

});



router.get("/bookshelves", async (req, res) => {
    var isUser;

    if (req.cookies.mail){
    isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelves = await Bookshelf.find({user_id: user._id}).populate('user_id');
    var likedBookshelves = await Bookshelf.find({liked_users: {$in: user._id }}).populate('user_id');

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

        for (let i=0; i<likedBookshelves.length; i++){
            if (likedBookshelves[i].liked_users.includes(user._id)){
                likedBookshelves[i].isLiked = true;
            }
            else{
                likedBookshelves[i].isLiked = false;
            }
        }

    }
    else{isUser = false;}


    res.render("../views/mybookshelves.hbs", {isUser: isUser, user:user, bookshelves: bookshelves, likedBookshelves: likedBookshelves});

});



router.get("/reviews", async (req, res) => {
    var isUser;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var rates = await Rate.find({user_id: user._id}).populate('user_id');
    var likedRates = await Rate.find({liked_users: {$in: user._id }}).populate('user_id');

    if (req.cookies.mail){
        isUser = true;

        for (let i=0; i<rates.length; i++){
            if (rates[i].liked_users.includes(user._id)){
                rates[i].isLiked = true;
            }
            else{
                rates[i].isLiked = false;
            }
        }

        for (let i=0; i<likedRates.length; i++){
            if (likedRates[i].liked_users.includes(user._id)){
                likedRates[i].isLiked = true;
            }
            else{
                likedRates[i].isLiked = false;
            }
        }

    }
    else{isUser = false;}

    res.render("../views/myreviews.hbs", {isUser: isUser, user:user, rates: rates, likedRates: likedRates});

});



router.get("/bookshelves/like", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelf = await Bookshelf.findOne({_id: id});

    if (req.cookies.mail){
        if (bookshelf.liked_users.includes(user._id)){
            res.redirect("/profile/bookshelves");
        }
        else{
            bookshelf.like_count += 1;
            bookshelf.liked_users.push(user._id);

            bookshelf.save()
            res.redirect("/profile/bookshelves");
        }
    }
}); 


router.get("/bookshelves/unlike", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelf = await Bookshelf.findOne({_id: id});

    if (req.cookies.mail){
        if (bookshelf.liked_users.includes(user._id)){
            bookshelf.like_count -= 1;
            const index = bookshelf.liked_users.indexOf(user._id);
            bookshelf.liked_users.splice(index, 1);

            bookshelf.save()
            res.redirect("/profile/bookshelves");
        }
        else{
            res.redirect("/profile/bookshelves");
        }
    }
}); 


router.get("/bookshelves/del", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var bookshelf = await Bookshelf.findOne({_id: id});

    if (req.cookies.mail){
        try{
            await Bookshelf.findOneAndDelete({_id: id, user_id: user._id});
            res.redirect("/profile/bookshelves");    
        }
        catch{
            res.redirect("/profile/bookshelves");
        }
    }
    else{
        res.redirect("/profile/bookshelves");
    }
});



router.get("/reviews/like", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }


    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});

    if (req.cookies.mail){
        if (rate.liked_users.includes(user._id)){
            res.redirect("/profile/reviews");
        }
        else{
            rate.like_count += 1;
            rate.liked_users.push(user._id);

            rate.save()
            res.redirect("/profile/reviews");
        }
    }
}); 


router.get("/reviews/unlike", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    var rate = await Rate.findOne({_id: id});

    if (req.cookies.mail){
        if (rate.liked_users.includes(user._id)){
            rate.like_count -= 1;
            const index = rate.liked_users.indexOf(user._id);
            rate.liked_users.splice(index, 1);

            rate.save()
            res.redirect("/profile/reviews");
        }
        else{
            res.redirect("/profile/reviews");
        }
    }
}); 


router.get("/reviews/del", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    if (req.cookies.mail){
        try{
            var rate = await Rate.findOne({_id: id});
            var book = await Book.findOne({_id: rate.book_id});
            book.rate_count -= 1;
            book.save();

            await Rate.findOneAndDelete({_id: id, user_id: user._id});
            res.redirect("/profile/reviews");    
        }
        catch{
            res.redirect("/profile/reviews");
        }
    }
    else{
        res.redirect("/profile/reviews");
    }
});


router.post("/bookshelves", async (req, res) => {
    const user = await User.findOne({mail: req.cookies.mail});

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }
    const { title } = req.body;

    if (req.cookies.mail){
        try{
            var bookshelf = await Bookshelf.create([
            {
                user_id: user._id,
                liked_users: [],
                shelf_books: [],
                shelfname: title,
                like_count: 0,
                isLiked: false
            }
            ]);

            res.redirect(`/profile/bookshelves`);
        }
        catch{
            res.redirect(`/profile/bookshelves`);
        }
    }
    else{
        res.redirect(`/profile/bookshelves`);
    }
});


router.get("/out", async (req, res) => {
    var id = req.query.id;

    if (req.cookies.mail){
        isUser = true;
    }
    else{
        res.redirect("/signin");
        isUser = false;
    }

    const user = await User.findOne({mail: req.cookies.mail});
    if (req.cookies.mail){
        try{
            res.clearCookie('mail');
            res.clearCookie('token');
            res.redirect("/");    
        }
        catch{
            res.redirect("/");
        }
    }
    else{
        res.redirect("/");
    }
});



module.exports = router
