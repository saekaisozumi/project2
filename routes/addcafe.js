const express = require("express");
const router = express.Router();
const Cafe = require("../models/Cafe");
const Comment = require("../models/Comment");
const uploadCloud = require("../config/cloudinary.js");
var NodeGeocoder = require("node-geocoder");
var options = {
  provider: "mapquest",
  apiKey: process.env.mapquest // for Mapquest, OpenCage, Google Premier
};
var geocoder = NodeGeocoder(options);

//Get a cafe
router.get("/addCafe", (req, res, next) => {
  Cafe.find()
    .then(cafes => {
      res.render("cafes/addCafe.hbs", { cafes, user: req.user });
    })
    .catch(err => {
      next(err);
    });
});

//Login Check
const loginCheck = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

//Post a cafe data
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

//

//Get all comment
router.get("/details/:id/comments", (req, res, next) => {
  // 6 the axios get request is detected and handled
  Cafe.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "author"
      }
    })
    .then(cafe => {
      const comments = cafe.comments.map(comment => {
        return {
          content: comment.content,
          author: comment.author.username
        };
      });
      // 7 we respond with the list of comments obtained from the database for the given room -> FRONTEND
      res.json(comments);
    })
    .catch(err => {
      next(err);
    });
});

//Post a comment
router.post("/details/:id/comments", (req, res, next) => {
  // 2 the axios POST request is detected and handled
  console.log(req.params.id);
  const content = req.body.content;
  const author = req.user._id;
  const cafeId = req.params.id;

  Comment.create({
    content: content,
    author: author
  })
    .then(commentDocument => {
      const commentId = commentDocument._id;

      return Cafe.updateOne(
        { _id: cafeId },
        { $push: { comments: commentId } }
      );
    })
    .then(() => {
      // 3 once the comment has been created and the Room.comments updated, we send a response -> FRONTEND
      res.json({});
    })
    .catch(err => {
      next(err);
    });
});

router.patch("/details/:id", (req, res, next) => {
  const changes = req.body;
  Cafe.updateOne({ _id: req.params.id }, changes)
    .then(() => {
      res.json();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
