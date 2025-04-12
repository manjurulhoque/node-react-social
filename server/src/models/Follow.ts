import mongoose from "mongoose";

interface IFollow extends mongoose.Document {
    followerId: string;
    followingId: string;
    createdAt: Date;
}

const FollowSchema = new mongoose.Schema(
    {
        followerId: {
            type: String,
            required: true,
            index: true,
        },
        followingId: {
            type: String,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

// Create a compound index for uniqueness and query efficiency
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.model<IFollow>("Follow", FollowSchema);
