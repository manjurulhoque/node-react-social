import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Post } from "../interfaces/post.interface";
import AxiosConfig from "../AxiosConfig";

interface PostContextType {
    posts: Post[];
    loading: boolean;
    error: string | null;
    fetchPosts: () => Promise<void>;
    createPost: (postData: {
        description: string;
        images: string[];
    }) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    likePost: (postId: string) => Promise<void>;
    clearError: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePost must be used within a PostProvider");
    }
    return context;
};

interface PostProviderProps {
    children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    // Fetch posts when component mounts or auth state changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.get("/posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(res.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch posts");
            setLoading(false);
        }
    };

    const createPost = async (postData: {
        description: string;
        images: string[];
    }) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.post("/posts", postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts([res.data, ...posts]);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create post");
            setLoading(false);
        }
    };

    const deletePost = async (postId: string) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            await AxiosConfig.delete(`/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(posts.filter((post) => post._id !== postId));
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete post");
            setLoading(false);
        }
    };

    const likePost = async (postId: string) => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const res = await AxiosConfig.put(
                `/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the post in the posts array
            setPosts(
                posts.map((post) =>
                    post._id === postId
                        ? { ...post, likesCount: res.data.likesCount }
                        : post
                )
            );
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to like post");
        }
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <PostContext.Provider
            value={{
                posts,
                loading,
                error,
                fetchPosts,
                createPost,
                deletePost,
                likePost,
                clearError,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;
