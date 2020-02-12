const express = require("express");
const router = express.Router();
const yelp = require("yelp-fusion");
const apiKey = process.env.apiKeyYelp;

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.user);
  res.render("index", { user: req.user });
});

router.get("/caffees", (req, res, next) => {
  const searchRequest = {
    location: "berlin",
    // categories: “cafes”,
    categories: "cafes"
  };
  const client = yelp.client(apiKey);
  client
    .search(searchRequest)
    .then(response => {
      let venues = response.jsonBody.businesses;
      res.json(venues);
    })
    .catch(e => {
      console.log(e);
    });
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
