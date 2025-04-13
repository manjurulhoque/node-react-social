import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import { errorResponse, successResponse } from "../types/response";
import httpStatus from "http-status";
import { methodNotAllowed } from "../utils/common";

const router = Router();

//REGISTER
router.post("/register", async (req: Request, res: Response) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            res.status(httpStatus.BAD_REQUEST).json(
                errorResponse("User already exists")
            );
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
        res.status(httpStatus.OK).json(
            successResponse({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        );
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            errorResponse("Unable to register. Please try again later.")
        );
    }
});

// Apply method not allowed to non-POST requests to /register
router.all("/register", methodNotAllowed);

//LOGIN
router.post("/login", async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(httpStatus.NOT_FOUND).json(
                errorResponse("Email or password is incorrect")
            );
            return;
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            res.status(httpStatus.BAD_REQUEST).json(
                errorResponse("Email or password is incorrect")
            );
            return;
        }

        const userObj = user.toObject();

        res.status(httpStatus.OK).json(
            successResponse({
                _id: userObj._id,
                name: userObj.name,
                email: userObj.email,
                token: generateToken(userObj._id.toString(), userObj.email),
            })
        );
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            errorResponse("Unable to login. Please try again later.")
        );
        return;
    }
});

// Apply method not allowed to non-POST requests to /login
router.all("/login", methodNotAllowed);

export default router;
