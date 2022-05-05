const express = require("express");
const cors = require("cors");

const Cat = require("../models/cat");

const router = express.Router();
router.use(cors());

const jwtValidator = require("../middlewares/auth/jwtvalidator");
router.use(jwtValidator);

const searchbynamevalidator = require("../middlewares/ad/searchbynamevalidator");
const searchbygendervalidator = require("../middlewares/ad/searchbygendervalidator");
const inputvalidator = require("../middlewares/ad/inputvalidator");
const paramidvalidator = require("../middlewares/ad/paramidvalidator");
const updatevalidator = require("../middlewares/ad/updatevalidator");

router.get("/", async (req, res) => {
    try {
        let cats = await Cat.find().sort({ cname: "asc" });
        return res.status(200).send(cats);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

// http://localhost:9000/api/ad/cat?cname=Cat%2001
router.get("/:cname", searchbynamevalidator, async (req, res) => {
    try {
        let cat = await Cat.find({ cname: req.query.cname });
        if(cat == null)
        {
            cat = new Cat();
        }
        return res.status(200).send(cat);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

// http://localhost:9000/api/ad/cat/cat?cgender=Male
router.get("/cat/:cgender", searchbygendervalidator, async (req, res) => {
    try {
        let cats = await Cat.find({ gender: req.query.cgender });
        return res.status(200).send(cats);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

router.post("/", inputvalidator, async (req, res) => {
    try 
    {
        let cat = new Cat({
            cname: req.body.cname,
            gender: req.body.gender,
            description: req.body.description,
            likecount: 0,
            profilepicture: req.body.profilepicture
        });

        cat = await cat.save();

        if (cat._id == null) {
            return res.status(400).send("Failed to insert data");
        }

        return res.status(200).send(cat);
    }
    catch (e) {
        return res.status(500).send("Error : " + e.message);
    }
});

router.put("/:catId", [paramidvalidator, updatevalidator], async (req, res) => {
    try
    {
        let cat = await Cat.findById({_id: req.params.catId})
        if(cat == null)
        {
            return res.status(404).send("Record not found");
        }

        let result = await Cat.findOneAndUpdate(
            {_id: req.params.catId},
            req.body,
            { new : true }
        );

        if(result == null)
        {
            return res.status(400).send("Failed to update data");
        }

        return res.status(200).send(result);
    }
    catch (e) {
        return res.status(500).send("Error : " + e.message);
    }
});

router.delete("/:catId", paramidvalidator, async (req, res) => {
    try
    {
        let cat = await Cat.findOneAndDelete({ _id: req.params.catId });

        if (!cat) {
            return res.status(404).send("Record not found");
        }

        res.status(200).send(cat);
    }
    catch (e) {
        return res.status(500).send("Error : " + e.message);
    }
});

module.exports = router;