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

//
/* router.get("/main", (req, res, next) => {
  console.log(req.user);
  if (!req.user) {
    res.redirect("/");
    return;
  } else {
    res.render("main.hbs");
  }
});

router.get("/details", (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
    return;
  } else {
    res.render("details.hbs");
  }
}); */

////

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
  let venueId = req.params.id;
  const client = yelp.client(apiKey);

  // if (Cafe.findById(venueId)) {
  //   let foundId = Cafe.findById(venueId)
  //   console.log("FOUNDID", foundId);
  //   res.render("details.hbs", { venue: foundId });
  // }

  Cafe.count({ _id: venueId }, function(err, count) {
    if (count > 0) {
      //document exists });
      console.log("in db");
      Cafe.findById(venueId)
        .then(response => {
          let details = response;
          console.log("details", details);
          if (details) {
            res.render("details.hbs", { venue: details });
            return;
          }
        })
        .catch(e => {
          console.log("errors", e);
        });
    } else {
      console.log("COunt less");
      client
        .business(venueId)
        .then(response => {
          let details = response.jsonBody;
          //console.log("detailssss:", details);
          console.log("another response");
          res.render("details.hbs", { venue: details });
          // res.json(response.jsonBody.coordinates);
        })
        .catch(e => {
          console.log("another error");

          console.log(e);
        });
    }
  });
});

module.exports = router;
