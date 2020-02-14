const express = require("express");
const router = express.Router();
const Cafe = require("../models/Cafe");
const uploadCloud = require("../config/cloudinary.js");
var NodeGeocoder = require("node-geocoder");
var options = {
  provider: "mapquest",
  apiKey: process.env.mapquest // for Mapquest, OpenCage, Google Premier
};
var geocoder = NodeGeocoder(options);

//Add a cafe route
router.get("/addCafe", (req, res, next) => {
  res.render("cafes/addCafe");
});

// router.get("/newCafe", (req, res, next) => {
//   console.log(req.body);
//   var options = {
//     provider: "mapquest",
//     // Optional depending on the providers
//     httpAdapter: "https:localhost:3000", // Default
//     apiKey: process.env.mapquest, // for Mapquest, OpenCage, Google Premier
//     formatter: null // 'gpx', 'string', ...
//   };
//   geocoder
//     .geocode("29 champs elysée paris")
//     .then(function(res) {
//       console.log(res);
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
// });

router.post("/addCafe", uploadCloud.single("photo"), (req, res, next) => {
  const { name, address, display_phone, price, wifi, comments } = req.body;
  const file = req.file && req.file.url;
  const originalName = req.file && req.file.originalname;
  const image_url = file ? file : "";
  const imgName = originalName ? originalName : "";

  geocoder
    .geocode(address)
    .then(results => {
      //console.log("Address", address);
      //console.log("RESULTS", results);
      console.log("latitude", results[0].latitude);
      console.log(Object.keys(results[0]));
      console.log("longitude", results[0].longitude);

      Cafe.create({
        image_url,
        imgName,
        address,
        name,
        location: {
          display_address: address.split(",")
        },
        display_phone,
        price,
        wifi,
        comments,

        // coordinates: [results[0].latitude, results[0].longitude]
        coordinates: {
          latitude: results[0].latitude,
          longitude: results[0].longitude
        }
      });
      //console.log("COORDINATES", coordinates);
    })

    .then(() => {
      res.redirect("/main");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
