import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";
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
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
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
    const [user, setUser] = useState<User | null>(null);
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
            setUser(res.data);
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
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (err: any) {
            console.log(err);
            setError(err.response?.data?.error?.message || "Login failed");
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const res = await AxiosConfig.post("/auth/register", {
                name,
                email,
                password,
            });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Registration failed");
            setLoading(false);
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
