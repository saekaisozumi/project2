const express = require("express");
const router = express.Router();
const axios = require("axios");
const yelp = require("yelp-fusion");
const apiKey = process.env.apiKeyYelp;

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
    categories: "internetcafe"
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

// router.get("/caffees/:id/coordinates", (req, res, next) => {
//   const client = yelp.client(apiKey);

//   let venueId = req.params.id;
//   console.log("WORKING", venueId);
//   client
//     .business("gary-danko-san-francisco")
//     .then(response => {
//       res.json(response.jsonBody.coordinates);
//     })
//     .catch(e => {
//       console.log(e);
//     });
// client.business(venueId).then(response => {
//  console.log("API RESPONSE", response);
//     res.json(response.jsonBody.coordinates);
// });
//   .catch(e => {
//     console.log(e);
//   });
// });

module.exports = router;
