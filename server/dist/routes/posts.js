"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
//create a post
router.post("/", async (req, res) => {
    const newPost = new Post_1.default(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("the post has been updated");
        }
        else {
            res.status(403).json("you can update only your post");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted");
        }
        else {
            res.status(403).json("you can delete only your post");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//like / dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User_1.default.findById(req.body.userId);
        if (!currentUser) {
            return res.status(404).json("User not found");
        }
        const userPosts = await Post_1.default.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(currentUser.followings.map((friendId) => {
            return Post_1.default.find({ userId: friendId });
        }));
        res.json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = router;
