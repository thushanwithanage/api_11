const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
