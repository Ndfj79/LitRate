const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("это страница на которой можно найти автора книги");
});

module.exports = router