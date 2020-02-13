const express = require("express");
//const passport = require("passport");
//const ensureLogin = require("connect-ensure-login");
const router = express.Router();
const Cafe = require("../models/Cafe");

//Add a cafe route
router.get("/addCafe", (req, res, next) => {
  res.render("cafes/addCafe.hbs");
});

router.post("/addCafe", (req, res, next) => {
  const { name, address } = req.body;
  Cafe.create({
    name,
    address
  })
    .then(() => {
      res.redirect("/main");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
