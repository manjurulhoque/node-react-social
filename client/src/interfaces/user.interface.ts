export interface User {
    _id: string;
    name: string;
    email: string;
    username?: string;
    profilePicture: string;
    coverPicture: string;
    followersCount: number;
    followingsCount: number;
    isAdmin: boolean;
    description: string;
    city: string;
    from: string;
    relationship: number;
}
