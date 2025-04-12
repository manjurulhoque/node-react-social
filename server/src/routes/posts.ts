import { Router, Request, Response } from "express";
import status from "http-status";
import Post from "../models/Post";
import User from "../models/User";
import { successResponse, errorResponse } from "../types/response";
import Like from "../models/Like";
import Follow from "../models/Follow";

const router = Router();

// get all posts
router.get("/", async (req: Request, res: Response) => {
    const posts = await Post.find();
    res.status(status.OK).json(successResponse(posts));
});

//create a post
router.post("/", async (req: Request, res: Response) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(status.OK).json(successResponse(savedPost));
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to create post")
        );
    }
});

//update a post
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(status.NOT_FOUND)
                .json(errorResponse("Post not found"));
        }

        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(status.OK).json(
                successResponse(post, "Post updated successfully")
            );
        } else {
            res.status(status.FORBIDDEN).json(
                errorResponse("You can update only your post")
            );
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to update post")
        );
    }
});

//delete a post
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(status.NOT_FOUND)
                .json(errorResponse("Post not found"));
        }

        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(status.OK).json(
                successResponse(post, "Post deleted successfully")
            );
        } else {
            res.status(status.FORBIDDEN).json(
                errorResponse("You can delete only your post")
            );
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to delete post")
        );
    }
});

//like / dislike a post
router.put("/:id/like", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(status.NOT_FOUND)
                .json(errorResponse("Post not found"));
        }

        const isLiked = await Like.findOne({
            postId: req.params.id,
            userId: req.body.userId,
        });
        if (!isLiked && post.userId === req.body.userId) {
            return res
                .status(status.FORBIDDEN)
                .json(errorResponse("You cannot like your own post"));
        }
        if (!isLiked) {
            await Like.create({
                postId: req.params.id,
                userId: req.body.userId,
            });
            await post.updateOne({ $inc: { likesCount: 1 } });
            res.status(status.OK).json(
                successResponse(post, "Post liked successfully")
            );
        } else {
            await Like.deleteOne({
                postId: req.params.id,
                userId: req.body.userId,
            });
            await post.updateOne({ $inc: { likesCount: -1 } });
            res.status(status.OK).json(
                successResponse(post, "Post disliked successfully")
            );
        }
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to like/dislike post")
        );
    }
});

//get a post
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(status.NOT_FOUND)
                .json(errorResponse("Post not found"));
        }
        res.status(status.OK).json(
            successResponse(post, "Post found successfully")
        );
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to get post")
        );
    }
});

//get timeline posts
router.get("/timeline/all", async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        if (!currentUser) {
            return res
                .status(status.NOT_FOUND)
                .json(errorResponse("User not found"));
        }

        const userPosts = await Post.find({ userId: currentUser._id });
        const follows = await Follow.find({ followerId: currentUser._id });
        const friendPosts = await Promise.all(
            follows.map((follow) => {
                return Post.find({ userId: follow.followingId });
            })
        );
        res.status(status.OK).json(
            successResponse(
                userPosts.concat(...friendPosts),
                "Timeline posts fetched successfully"
            )
        );
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to get timeline posts")
        );
    }
});

export default router;
