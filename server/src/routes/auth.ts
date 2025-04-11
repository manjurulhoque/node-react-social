import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateToken from "../utils/generateToken";

const router = Router();

// The 405 handler
const methodNotAllowed = (req: Request, res: Response, next: NextFunction) =>
    res.status(405).json("Method not allowed");

//REGISTER
router.post("/register", async (req: Request, res: Response) => {
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
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Apply method not allowed to non-POST requests to /register
router.all("/register", methodNotAllowed);

//LOGIN
router.post("/login", async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("user not found");
            return;
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            res.status(400).json("wrong password");
            return;
        }

        const userObj = user.toObject();

        res.status(200).json({
            _id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            token: generateToken(userObj._id.toString(), userObj.email),
        });
    } catch (err) {
        res.status(500).json(err);
        return;
    }
});

// Apply method not allowed to non-POST requests to /login
router.all("/login", methodNotAllowed);

export default router;
