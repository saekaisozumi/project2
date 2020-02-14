const mongoose = require("mongoose");
const { Schema } = mongoose;
const cafeSchema = new Schema({
  imgName: String,
  image_url: String,
  name: String,
  location: {
    display_address: [String]
  },

  address: String,
  display_phone: String,
  price: {
    type: String,
    enum: ["€", "€€", "€€€"]
  },
  // wifi: {
  //   type: String,
  //   enum: ["★", "★★", "★★★"]
  // },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  yelpId: String
});

const Cafe = mongoose.model("Cafe", cafeSchema);
module.exports = Cafe;
