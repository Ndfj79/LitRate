const express = require("express");
const router = express.Router();
const {login} = require("../controllers/userController");

router.get("/", async (req, res) => {
    
    res.render("../views/signin.hbs", {});

});

router.post("/", login);

module.exports = router;