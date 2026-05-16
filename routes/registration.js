const express = require("express");
const router = express.Router();
const {signUp} = require("../controllers/userController")

router.get("/", async (req, res) => {
    
    res.render("../views/signup.hbs", {});
    
});

router.post("/", signUp);

module.exports = router