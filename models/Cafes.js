const mongoose = require("mongoose");
const { Schema } = mongoose;

const cafeSchema = new Schema({
  name: String,
  location: String,
  price: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  coordinates: [Number]
});

const Cafe = mongoose.model("Room", cafeSchema);

module.exports = Cafe;
