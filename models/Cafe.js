const mongoose = require("mongoose");
const { Schema } = mongoose;

const cafeSchema = new Schema({
  image: {
    type: String,
    default:
      "https://s3-media3.fl.yelpcdn.com/bphoto/Ot26uzXdx-poRgiGWyV_3w/o.jpg"
  },
  name: String,
  location: {
    address1: String,
    address2: String,
    street: String,
    city: String,
    zipcode: Number
  },
  phone: Number,
  price: {
    type: String
    //enum: [good, ok, no - good]
  },
  wifi: {
    type: String
    //enum: [good, ok, no - good]
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  coorinates: [Number]
});

const Cafe = mongoose.model("Room", cafeSchema);

module.exports = Cafe;
