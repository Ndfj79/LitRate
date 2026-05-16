const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
    
    res.render("../views/authors.hbs", {});

});

module.exports = router