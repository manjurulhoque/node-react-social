import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { User } from "../interfaces/user.interface";
import AxiosConfig from "../AxiosConfig";

interface UserContextType {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    fetchUserById: (userId: string) => Promise<void>;
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();

    // Set current user when auth user changes
    React.useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.get("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setLoading(false);
        }
    };

    const fetchUserById = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.get(`/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the user in the users array if it exists
            setUsers(
                users.map((user) => (user._id === userId ? res.data : user))
            );

            // If this is the current user, update currentUser
            if (currentUser && currentUser._id === userId) {
                setCurrentUser(res.data);
            }

            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch user");
            setLoading(false);
        }
    };

    const followUser = async (userId: string) => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.put(
                `/api/users/${userId}/follow`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the user in the users array
            setUsers(
                users.map((user) =>
                    user._id === userId
                        ? { ...user, followersCount: res.data.followersCount }
                        : user
                )
            );

            // Update current user's followings count
            if (currentUser) {
                setCurrentUser({
                    ...currentUser,
                    followingsCount: currentUser.followingsCount + 1,
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to follow user");
        }
    };

    const unfollowUser = async (userId: string) => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.put(
                `/api/users/${userId}/unfollow`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the user in the users array
            setUsers(
                users.map((user) =>
                    user._id === userId
                        ? { ...user, followersCount: res.data.followersCount }
                        : user
                )
            );

            // Update current user's followings count
            if (currentUser) {
                setCurrentUser({
                    ...currentUser,
                    followingsCount: currentUser.followingsCount - 1,
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to unfollow user");
        }
    };

    const updateProfile = async (userData: Partial<User>) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.put("/api/users/profile", userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update current user
            setCurrentUser(res.data);

            // Update the user in the users array if it exists
            setUsers(
                users.map((user) =>
                    user._id === res.data._id ? res.data : user
                )
            );

            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <UserContext.Provider
            value={{
                users,
                currentUser,
                loading,
                error,
                fetchUsers,
                fetchUserById,
                followUser,
                unfollowUser,
                updateProfile,
                clearError,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
