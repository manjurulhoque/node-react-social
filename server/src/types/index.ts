import { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: string[];
    followings: string[];
    isAdmin: boolean;
    description: string;
    city: string;
    from: string;
    relationship: number;
}

export interface IPost extends Document {
    userId: string;
    description: string;
    images: string[];
    likes: string[];
}
