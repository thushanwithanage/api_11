const express = require("express");
const cors = require("cors");

const Cat = require("../models/cat");

const router = express.Router();
router.use(cors());

router.get("/", async (req, res) => {
    try {
        let cats = await Cat.find().sort({ cname: "asc" });
        return res.status(200).send(cats);
    }
    catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

router.put("/:catId", async (req, res) => {
    let cat = await Cat.findById(req.params.catId);
    if (!cat) {
      return res.status(404).send("Record not found");
    }
  
    // validation
    if (!req.body.likecount) {
      return res.status(400).send("Like count not found");
    }
  
    cat.set({ likecount: req.body.likecount });
    cat = await cat.save();
    res.status(200).send(cat);
  });

module.exports = router;