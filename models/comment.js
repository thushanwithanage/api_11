const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    catId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    cdateTime: {
        type: Date
    },
    likecount: {
        type: Number,
        min: 0,
        default: 0
    }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
