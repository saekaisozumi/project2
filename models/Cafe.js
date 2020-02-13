const mongoose = require("mongoose");
const { Schema } = mongoose;
const cafeSchema = new Schema({
  imgName: String,
  imgPath: String,
  name: String,
  address: String,
  /* address2: String,
    city: String,
    zipcode: Number, */
  phone: String,
  price: {
    type: String,
    enum: ["€", "€€", "€€€"]
  },
  wifi: {
    type: String,
    enum: ["★", "★★", "★★★"]
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
  /* coorinates: [Number] */
});

const Cafe = mongoose.model("Room", cafeSchema);
module.exports = Cafe;
