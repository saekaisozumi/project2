const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.user);
  res.render("index", { user: req.user });
});

/* router.get("/main", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  } else {
    res.render("main.hbs");
  }
}); */

module.exports = router;
