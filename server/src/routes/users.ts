import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Follow from "../models/Follow";
import { errorResponse, successResponse } from "../types/response";
import httpStatus from "http-status";

const router = Router();

//update user
router.put("/:id", async (req: Request, res: Response) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("Unable to update account. Please try again later."));
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(httpStatus.OK).json(successResponse("Account has been updated"));
        } catch (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("Unable to update account. Please try again later."));
        }
    } else {
        return res.status(httpStatus.FORBIDDEN).json(errorResponse("You can update only your account!"));
    }
});

//delete user
router.delete("/:id", async (req: Request, res: Response) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(httpStatus.OK).json(successResponse("Account has been deleted"));
        } catch (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("Unable to delete account. Please try again later."));
        }
    } else {
        return res.status(httpStatus.FORBIDDEN).json(errorResponse("You can delete only your account!"));
    }
});

// get current user
router.get("/me", async (req: Request, res: Response) => {
    const user = await User.findById(req.body.userId);
    res.status(httpStatus.OK).json(successResponse(user));
});

//get a user
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json(errorResponse("User not found"));
        }

        const userObject = user.toObject();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...other } = userObject;
        res.status(httpStatus.OK).json(successResponse(other));
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("Unable to get user. Please try again later."));
    }
});

//follow a user
router.put("/:id/follow", async (req: Request, res: Response) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user || !currentUser) {
                return res.status(httpStatus.NOT_FOUND).json(errorResponse("User not found"));
            }

            const existingFollow = await Follow.findOne({
                followerId: req.body.userId,
                followingId: req.params.id
            });

            if (!existingFollow) {
                await Follow.create({
                    followerId: req.body.userId,
                    followingId: req.params.id
                });
                await user.updateOne({ $inc: { followersCount: 1 } });
                await currentUser.updateOne({ $inc: { followingsCount: 1 } });
                res.status(httpStatus.OK).json(successResponse("User has been followed"));
            } else {
                res.status(httpStatus.FORBIDDEN).json(errorResponse("You already follow this user"));
            }
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("Unable to follow user. Please try again later."));
        }
    } else {
        res.status(httpStatus.FORBIDDEN).json(errorResponse("You cant follow yourself"));
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req: Request, res: Response) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user || !currentUser) {
                return res.status(httpStatus.NOT_FOUND).json(errorResponse("User not found"));
            }

            const existingFollow = await Follow.findOne({
                followerId: req.body.userId,
                followingId: req.params.id
            });

            if (existingFollow) {
                await Follow.deleteOne({
                    followerId: req.body.userId,
                    followingId: req.params.id
                });
                await user.updateOne({ $inc: { followersCount: -1 } });
                await currentUser.updateOne({ $inc: { followingsCount: -1 } });
                res.status(httpStatus.OK).json(successResponse("User has been unfollowed"));
            } else {
                res.status(httpStatus.FORBIDDEN).json(errorResponse("You don't follow this user"));
            }
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("Unable to unfollow user. Please try again later."));
        }
    } else {
        res.status(httpStatus.FORBIDDEN).json(errorResponse("You cant unfollow yourself"));
    }
});

export default router;
