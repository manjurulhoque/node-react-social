import mongoose from "mongoose";
import { IPost } from "../types";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        images: {
            type: Array,
            default: [],
        },
        likesCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
