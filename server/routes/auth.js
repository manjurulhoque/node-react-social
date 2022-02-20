const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// The 405 handler
const methodNotAllowed = (req, res, next) => res.status(405).json("Method not allowed");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            res.status(400).json("User already exists");
            return;
        }
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}).all(methodNotAllowed);

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("user not found");
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            res.status(400).json("wrong password");
            return;
        }

        let userObj = user.toObject();

        res.status(200).json({
            _id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            token: generateToken(userObj._id, userObj.email),
        })
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}).all(methodNotAllowed);

module.exports = router;
