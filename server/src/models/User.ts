import mongoose from "mongoose";
import { IUser } from "../types";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },
        followersCount: {
            type: Number,
            default: 0,
        },
        followingsCount: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            max: 100,
            default: "",
        },
        from: {
            type: String,
            max: 100,
            default: "",
        },
        relationship: {
            type: Number,
            enum: [1, 2, 3],
        },
    },
    { timestamps: true, toObject: { versionKey: false } }
);

export default mongoose.model<IUser>("User", UserSchema);
