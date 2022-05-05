const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
    cname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: "Male"
    },
    description: {
        type: String,
        minlength: 5
    },
    likecount: {
        type: Number,
        min: 0,
        default: 0
    },
    profilepicture: {
        type: String
    }
});

const Cat = mongoose.model("Cat", catSchema);
module.exports = Cat;
