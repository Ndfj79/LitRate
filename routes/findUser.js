const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Это страница на которой можно найти пользователя");
});

module.exports = router