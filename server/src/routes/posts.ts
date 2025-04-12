import { Router, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import { successResponse, errorResponse } from "../types/response";

const router = Router();

// get all posts
router.get("/", async (req: Request, res: Response) => {
    const posts = await Post.find();
    res.status(200).json(successResponse(posts));
});

//create a post
router.post("/", async (req: Request, res: Response) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(successResponse(savedPost));
    } catch (err) {
        res.status(500).json(errorResponse(500, "Failed to create post"));
    }
});

//update a post
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json(errorResponse(404, "Post not found"));
        }

        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json(successResponse(post, "Post updated successfully"));
        } else {
            res.status(403).json(errorResponse(403, "You can update only your post"));
        }
    } catch (err) {
        res.status(500).json(errorResponse(500, "Failed to update post"));
    }
});

//delete a post
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json(errorResponse(404, "Post not found"));
        }

        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json(successResponse(post, "Post deleted successfully"));
        } else {
            res.status(403).json(errorResponse(403, "You can delete only your post"));
        }
    } catch (err) {
        res.status(500).json(errorResponse(500, "Failed to delete post"));
    }
});

//like / dislike a post
router.put("/:id/like", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json(errorResponse(404, "Post not found"));
        }

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json(successResponse(post, "Post liked successfully"));
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json(successResponse(post, "Post disliked successfully"));
        }
    } catch (err) {
        res.status(500).json(errorResponse(500, "Failed to like/dislike post"));
    }
});

//get a post
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json(errorResponse(404, "Post not found"));
        }
        res.status(200).json(successResponse(post, "Post found successfully"));
    } catch (err) {
        res.status(500).json(errorResponse(500, "Failed to get post"));
    }
});

//get timeline posts
router.get("/timeline/all", async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        if (!currentUser) {
            return res.status(404).json(errorResponse(404, "User not found"));
        }

        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId: string) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(successResponse(userPosts.concat(...friendPosts), "Timeline posts fetched successfully"));
    } catch (err) {
        res.status(500).json(errorResponse(500, "Failed to get timeline posts"));
    }
});

export default router;
