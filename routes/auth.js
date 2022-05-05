const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");

const User = require("../models/user");
const GoogleUser = require("../models/googleUser");

const { OAuth2Client } = require("google-auth-library");

dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const router = express.Router();
router.use(cors());
router.use(express.json());

const signinValidator = require("../middlewares/auth/signinvalidator");
const signupValidator = require("../middlewares/auth/signupvalidator");
const forgotpwvalidator = require("../middlewares/auth/forgotpwvalidator");
const paramvalidator = require("../middlewares/auth/paramvalidator");

router.post("/", signinValidator, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User account not found");
    }

    /*const hash = await bcrypt.compare(req.body.password, user.password);

    if (!hash) {
      return res.status(400).send("Invalid credentials");
    }*/

    if(req.body.password != user.password)
    {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id,
        uname: user.uname,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "6h" }
    );

    return res.status(200).send({ token: token, isAdmin: user.isAdmin });
  } catch (e) {
    console.log("Error : " + e.message);
    return res.status(500).send("Signin Error : " + e.message);
  }
});

router.post("/signup", signupValidator, async (req, res) => {
  try {

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send("User account already exists. Please Signin to continue");
    }

    /*const salt = await bcrypt.genSalt(20);
    const hash = await bcrypt.hash(req.body.password, salt);*/
    const hash = req.body.password;

    user = new User({
      uname: req.body.uname,
      mobile: req.body.mobile,
      gender: req.body.gender,
      email: req.body.email,
      password: hash,
      isAdmin: false,
    });

    user = await user.save();

    if (user._id == null) {
      return res.status(400).send("Data insertion failed");
    }

    const token = jwt.sign(
      {
        id: user._id,
        uname: user.uname,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "6h" }
    );

    return res.status(200).send({ token: token, isAdmin: false });
  } catch (e) {
    console.log("Error : " + e.message);
    return res.status(500).send("Signup Error : " + e.message);
  }
});

router.post("/googleLogin", async (req, res) => {
  try {
    const { gtoken } = req.body;

    if (!gtoken) {
      return res.status(400).send("Google Signup Error : Token not found");
    }

    const data = await client.verifyIdToken({
      idToken: gtoken,
      audience: process.env.CLIENT_ID,
    });

    if (!data) {
      return res.status(400).send("Failed to verfy Google token");
    }

    let guser = await GoogleUser.findOne({ email: data.getPayload().email });

    if (!guser) {
      let user = new GoogleUser({
        uname: data.getPayload().name,
        email: data.getPayload().email,
      });

      guser = await user.save();

      if (guser._id == null) {
        return res.status(400).send("Google signin failed");
      }
    }
    const token = jwt.sign(
      { id: guser._id, uname: guser.uname, email: guser.email, isAdmin: false },
      process.env.SECRET_KEY,
      { expiresIn: "6h" }
    );

    return res.status(200).send({ token: token });
  } catch (e) {
    console.log("Error : " + e.message);
    return res.status(500).send("Google Signup Error : " + e.message);
  }
});

router.post("/forgotpw", forgotpwvalidator, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User account not found");
    }

    var transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD,
      },
    });

    const resetCode = Math.floor(100000 + Math.random() * 900000);

    var mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "CattyLove account password recovery email",
      text:
        "Hello user,\n\nPlease find your CattyLove account recovery code " +
        resetCode +
        "\n\nThanks,\nCattyLove Team",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(400).send("Failed to send password reset link");
      } else {
        console.log(resetCode);
        console.log("Email sent: " + info.response);
        return res.status(200).send({ vcode: resetCode, userId: user._id });
      }
    });
  } catch (e) {
    console.log("Error : " + e.message);
    return res.status(500).send("Signin Error : " + e.message);
  }
});

router.put("/reset/:userId", paramvalidator, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userId });

    if (!user) {
      return res.status(400).send("User account not found");
    }

    /*const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    req.body.password = hash;*/

    let result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: false }
    );

    if (result == null) {
      return res.status(400).send("Failed to update password");
    }

    return res.status(200).send(result);
  } catch (e) {
    console.log("Error : " + e.message);
    return res.status(500).send("Update Error : " + e.message);
  }
});

module.exports = router;
