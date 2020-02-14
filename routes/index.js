const express = require("express");
const router = express.Router();
const axios = require("axios");
const yelp = require("yelp-fusion");
const apiKey = process.env.apiKeyYelp;
const Cafe = require("../models/Cafe");

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.user);
  res.render("index.hbs");
});

router.get("/main", (req, res, next) => {
  res.render("main.hbs");
});

router.get("/caffees", (req, res, next) => {
  const searchRequest = {
    location: "mitte,berlin",
    // categories: "cafes",
    categories: "cafes"
  };
  const client = yelp.client(apiKey);
  client
    .search(searchRequest)
    .then(response => {
      let venues = response.jsonBody.businesses;

      // // retrieve cafes from DB
      Cafe.find().then(myCafes => {
        //venues should be an array with the cafes from yelp and the cafes from DB
        res.json([...venues, ...myCafes]);
      });

      //res.json(venues);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/details/:id", (req, res, next) => {
  const client = yelp.client(apiKey);

  let venueId = req.params.id;
  // this is if it is yelp api information
  if (venueId != "undefined") {
    console.log("WORKING", venueId);
    client
      .business(venueId)
      .then(response => {
        let details = response.jsonBody;
        //console.log("detailssss:", details);

        res.render("details.hbs", { venue: details });
        // res.json(response.jsonBody.coordinates);
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    // here you get database information and then render it :)
    res.render("details.hbs");
  }
});

module.exports = router;
