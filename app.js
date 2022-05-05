const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/auth");
const ad = require("./routes/ad");
const user = require("./routes/user");

const app = express();

const corsConfig = {
    credentials: true,
    origin: true,
};

app.use(cors(corsConfig));
app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/ad", ad);
app.use("/api/user", user);

const port = process.env.PORT || 9000;

mongoose
    .connect(
        process.env.MONGODB_CONNECTION_STRING,
        { useNewUrlParser: true }
    )
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log("Listening on port " + port);
});