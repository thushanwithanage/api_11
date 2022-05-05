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
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        lowercase: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
