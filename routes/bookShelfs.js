const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Это страница на которой представлены популярные книжные полки");
});

module.exports = router