const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Cat = require("../models/cat");

const router = express.Router();

SECRET_KEY = "123456789";

router.get("/", async (req, res) => {
    try {
        let cats = await Cat.find().sort({ cname: "asc" });
        return res.send(cats);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

// http://localhost:9000/api/ad/cat?cname=Cat%2001
router.get("/:cname", async (req, res) => {
    try {
        let cat = await Cat.find({ cname: req.query.cname });
        if(cat == null)
        {
            cat = new Cat();
        }
        return res.send(cat);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

// http://localhost:9000/api/ad/cat/cat?cgender=Male
router.get("/cat/:cgender", async (req, res) => {
    try {
        let cats = await Cat.find({ gender: req.query.cgender });
        return res.send(cats);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

router.post("/", async (req, res) => {

    /*const token = req.header("x-jwt-token");
    if (!token) {
        console.log("Access token not found");
        return res.status(401).send("Access token not found");
    }

    try {
        jwt.verify(token, SECRET_KEY);
    } catch (e) {
        console.log("Invalid token");
        return res.status(400).send("Invalid token");
    }

    let decoded = jwt.decode(token, SECRET_KEY);
    if (!decoded.isAdmin) {
        console.log("Access forbidden");
        return res.status(403).send("Access forbidden")
    }*/

    try {
        let cat = new Cat({
            cname: req.body.cname,
            gender: req.body.gender,
            description: req.body.description,
            likecount: 0,
            profilepicture: req.body.profilepicture
        });

        cat = await cat.save();

        if (cat._id == null) {
            return res.status(400).send("Data insertion failed");
        }

        return res.status(200).send(cat);
    }
    catch (e) {
        return res.status(500).send("Error : " + e.message);
    }
});

router.delete("/:catId", async (req, res) => {
    /*const token = req.header("x-jwt-token");
    if (!token) {
        console.log("Access token not found");
        return res.status(401).send("Access token not found");
    };

    try {
        jwt.verify(token, SECRET_KEY);
    }
    catch (e) {
        console.log("Invalid token");
        return res.status(400).send("Invalid token");
    }

    let decoded = jwt.decode(token, SECRET_KEY);
    if (!decoded.isAdmin) {
        return res.status(403).send("Access forbidden")
    }*/

    let cat = await Cat.findOneAndDelete({ _id: req.params.catId });

    if (!cat) {
        return res.status(404).send("Not found");
    }

    res.status(200).send(cat);
});

module.exports = router;