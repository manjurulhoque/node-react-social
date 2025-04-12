import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Follow from "../models/Follow";

const router = Router();

//update user
router.put("/:id", async (req: Request, res: Response) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

//delete user
router.delete("/:id", async (req: Request, res: Response) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

//get a user
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json("User not found");
        }

        const userObject = user.toObject();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...other } = userObject;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

//follow a user
router.put("/:id/follow", async (req: Request, res: Response) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user || !currentUser) {
                return res.status(404).json("User not found");
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
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req: Request, res: Response) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user || !currentUser) {
                return res.status(404).json("User not found");
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
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You don't follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cant unfollow yourself");
    }
});

export default router;
