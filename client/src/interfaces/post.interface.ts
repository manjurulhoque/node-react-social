import { User } from "./user.interface";

export interface Post {
    _id: string;
    userId: string;
    description: string;
    images: string[];
    likesCount: number;
    createdAt: string;
    updatedAt: string;
    user?: User;
}
