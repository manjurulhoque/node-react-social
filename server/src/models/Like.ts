import mongoose from "mongoose";

interface ILike extends mongoose.Document {
    postId: string;
    userId: string;
    createdAt: Date;
}

const LikeSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Create a compound index for uniqueness and query efficiency
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ILike>("Like", LikeSchema);
