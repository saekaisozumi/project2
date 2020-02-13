const express = require("express");
const router = express.Router();
const Cafe = require("../models/Cafe");
const uploadCloud = require("../config/cloudinary.js");

//Add a cafe route
router.get("/addCafe", (req, res, next) => {
  res.render("cafes/addCafe.hbs");
});

router.post("/addCafe", uploadCloud.single("photo"), (req, res, next) => {
  const { name, address, phone, price, wifi, comments } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  Cafe.create({
    imgPath,
    imgName,
    name,
    address,
    phone,
    price,
    wifi,
    comments
  })
    .then(() => {
      res.redirect("/main");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
