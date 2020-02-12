const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  name: String,
  coorinates: [Number],
  address: String,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

const Cafe = mongoose.model("Cafe", cafeSchema);
module.exports = Cafe;
