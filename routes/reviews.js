const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Это страница с рецензиями на книги!");
});

module.exports = router