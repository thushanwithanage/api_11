const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/auth");
const ad = require("./routes/ad");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/ad", ad);

const port = process.env.PORT || 9000;

mongoose
    .connect(
        "mongodb+srv://wad-user:wadproject@cluster0.yirzk.mongodb.net/CattyLove?retryWrites=true&w=majority",
        { useNewUrlParser: true }
    )
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log("Listening on port " + port);
});