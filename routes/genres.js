const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Cover = require('../models/Cover');


router.get("/", async (req, res) => {
    
    res.render("../views/genres.hbs", {});

});

module.exports = router