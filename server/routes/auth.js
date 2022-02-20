const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

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
        const user = await User.findOne({ email: req.body.email }).select('-__v');
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password");

        let userObj = user.toObject();

        delete userObj.password;
        res.status(200).json(userObj);
    } catch (err) {
        res.status(500).json(err)
    }
}).all(methodNotAllowed);

module.exports = router;
