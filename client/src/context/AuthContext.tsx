import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import AxiosConfig from "../AxiosConfig";

interface User {
    _id: string;
    name: string;
    email: string;
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

interface AuthContextType {
    user: Partial<User> | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        username: string,
        email: string,
        password: string
    ) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Partial<User> | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp && decoded.exp < currentTime) {
                    // Token expired
                    localStorage.removeItem("token");
                    setLoading(false);
                } else {
                    // Token valid, fetch user data
                    fetchUserData(token);
                }
            } catch (err) {
                localStorage.removeItem("token");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (token: string) => {
        try {
            const res = await AxiosConfig.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data.data);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (err) {
            localStorage.removeItem("token");
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const res = await AxiosConfig.post("/auth/login", {
                email,
                password,
            });

            // Check if the response has the expected structure
            if (res.data && res.data.data && res.data.data.token) {
                localStorage.setItem("token", res.data.data.token);
                setUser({
                    _id: res.data.data.user?._id,
                    name: res.data.data.user?.name,
                    email: res.data.data.user?.email,
                    profilePicture: res.data.data.user?.profilePicture,
                    coverPicture: res.data.data.user?.coverPicture,
                    followersCount: res.data.data.user?.followersCount,
                    followingsCount: res.data.data.user?.followingsCount,
                });
                setIsAuthenticated(true);
            } else {
                // Handle unexpected response structure
                console.error("Unexpected login response structure:", res.data);
                setError("Login failed: Invalid response from server");
            }

            setLoading(false);
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.error?.message || "Login failed");
            setLoading(false);
        }
    };

    const register = async (
        name: string,
        username: string,
        email: string,
        password: string
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const res = await AxiosConfig.post("/auth/register", {
                name,
                username,
                email,
                password,
            });

            // Check if the response has the expected structure
            if (res.data && res.data.data) {
                // Registration successful, but don't log in automatically
                setLoading(false);
                return true;
            } else {
                // Handle unexpected response structure
                console.error(
                    "Unexpected register response structure:",
                    res.data
                );
                setError("Registration failed: Invalid response from server");
                setLoading(false);
                return false;
            }
        } catch (err: any) {
            setError(
                err.response?.data?.error?.message || "Registration failed"
            );
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                error,
                login,
                register,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
