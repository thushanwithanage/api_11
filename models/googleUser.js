const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);
module.exports = GoogleUser;
