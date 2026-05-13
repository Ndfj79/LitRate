const express = require("express");
const router = express.Router();
const Book = require('../models/Book');

let books = Book.find({});
let cards = [];

for (let i=0; i<books.length;i++){
    cards.push({
        title: books[i].title,
        authors: books[i].authors,
        isbn: books[i].isbn,
    })    

}


router.get("/", (req, res) => {
    res.render("../views/index.hbs", {books});
});

module.exports = router

