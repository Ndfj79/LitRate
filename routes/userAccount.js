const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Это личная страница пользователя!");
});

module.exports = router
