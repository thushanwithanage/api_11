const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const User = require("../models/user");

const router = express.Router();

router.use(cors({ origin: 'http://localhost:3000', credentials: true }));
router.use(express.json());
router.use(cookieParser());

SECRET_KEY = "123456789";

router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("User account not found");
        }

        const hash = await bcrypt.compare(req.body.password, user.password);
        if (!hash) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, uname: user.uname, email: user.email, isAdmin: user.isAdmin },
            SECRET_KEY, { expiresIn: "1h" }
        );

        return res.status(200).cookie('token', token, {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().getTime() + 100 * 1000),
            httpOnly: true,
		}).send({ token: token });

    } catch (e) {
        return res.status(500).send(e.message);
    }
});

router.post("/signup", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt)
        let user = new User({
            uname: req.body.uname,
            mobile: req.body.mobile,
            gender: req.body.gender,
            email: req.body.email,
            password: hash,
            isAdmin: false
        });

        user = await user.save();

        if(user._id == null)
        {
            return res.status(400).send("Data insertion failed");
        }

        const token = jwt.sign(
            { id: user._id, uname: user.uname, email: user.email, isAdmin: user.isAdmin },
            SECRET_KEY, { expiresIn: "1h" }
        );
        console.log(token);

        
        return res.status(200).send({ token: token });
    }
    catch (e) {
        return res.status(500).send("Error : " + e.message);
    }
});

router.get('/', (req, res) => {
    const token = jwt.sign(
        { id: "user._id", uname: "user.uname", email: "user.email", isAdmin: "user.isAdmin" },
        SECRET_KEY, { expiresIn: "1h" }
    );

	res
		.status(200)
		.cookie('token', token, {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().getTime() + 100 * 1000),
            httpOnly: true,
		}).send("cookie being initialised")
});

router.get('/deleteCookie', (req, res) => {
	res
		.status(202)
		.clearCookie('Name').send("cookies cleared")
});

module.exports = router;