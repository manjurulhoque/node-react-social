"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const router = (0, express_1.Router)();
// The 405 handler
const methodNotAllowed = (_req, res) => res.status(405).json("Method not allowed");
//REGISTER
router
    .post("/register", async (req, res) => {
    try {
        const userExists = await User_1.default.findOne({ email: req.body.email });
        if (userExists) {
            res.status(400).json("User already exists");
            return;
        }
        //generate new password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, salt);
        //create new user
        const newUser = new User_1.default({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and respond
        const user = await newUser.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})
    .all(methodNotAllowed);
//LOGIN
router
    .post("/login", async (req, res) => {
    try {
        const user = await User_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("user not found");
            return;
        }
        const validPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json("wrong password");
            return;
        }
        let userObj = user.toObject();
        res.status(200).json({
            _id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            token: (0, generateToken_1.default)(userObj._id.toString(), userObj.email),
        });
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
})
    .all(methodNotAllowed);
exports.default = router;
