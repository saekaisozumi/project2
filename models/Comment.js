const mongoose = require("mongoose");
const { Schema } = mongoose;
const commentSchema = new Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  yelpId: String /* ,
  wifi: {
    type: String,
    enum: ["★", "★★", "★★★"]
  } */
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
