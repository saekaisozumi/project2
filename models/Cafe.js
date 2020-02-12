const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  name: String,
  address: String,

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  coorinates: [Number]
});

const Cafe = mongoose.model("Cafe", cafeSchema);
module.exports = Cafe;
