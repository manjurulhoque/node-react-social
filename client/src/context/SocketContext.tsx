import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            const token = localStorage.getItem("token");
            const newSocket = io(
                process.env.REACT_APP_API_URL || "http://localhost:8800",
                {
                    auth: { token },
                }
            );

            newSocket.on("connect", () => {
                console.log("Socket connected");
                setIsConnected(true);
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected");
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
