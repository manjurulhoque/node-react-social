import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthenticatedSocket extends Socket {
    userId?: string;
    username?: string;
}

class SocketService {
    private io: SocketServer;
    private userSockets: Map<string, string> = new Map(); // userId -> socketId
    private socketUsers: Map<string, string> = new Map(); // socketId -> userId

    constructor(server: HttpServer) {
        this.io = new SocketServer(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3006",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    private setupMiddleware() {
        this.io.use(async (socket: AuthenticatedSocket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error("Authentication error"));
                }

                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || "secret"
                ) as { id: string };
                const user = await User.findById(decoded.id);

                if (!user) {
                    return next(new Error("User not found"));
                }
                socket.userId = user._id.toString();
                socket.username = user.username;
                next();
            } catch (err) {
                next(new Error("Authentication error"));
            }
        });
    }

    private setupEventHandlers() {
        this.io.on("connection", (socket: AuthenticatedSocket) => {
            console.log(`User ${socket.username} and id (${socket.userId}) connected via socket: ${socket.id}`);

            // Store user-socket mapping
            if (socket.userId) {
                this.userSockets.set(socket.userId, socket.id);
                this.socketUsers.set(socket.id, socket.userId);
            }

            // Handle private messages
            socket.on(
                "private_message",
                async (data: { to: string; message: string }) => {
                    const targetSocketId = this.userSockets.get(data.to);
                    if (targetSocketId) {
                        this.io.to(targetSocketId).emit("private_message", {
                            from: socket.userId,
                            fromUsername: socket.username,
                            message: data.message,
                        });
                    }
                }
            );

            // Handle call signals
            socket.on(
                "call_user",
                (data: {
                    to: string;
                    signalData: any;
                    from: string;
                    name: string;
                }) => {
                    const targetSocketId = this.userSockets.get(data.to);
                    console.log("call_user", data, this.userSockets, targetSocketId);
                    if (targetSocketId) {
                        this.io.to(targetSocketId).emit("call_received", {
                            signal: data.signalData,
                            from: data.from,
                            name: data.name,
                        });
                    }
                }
            );

            socket.on("answer_call", (data: { to: string; signal: any }) => {
                const targetSocketId = this.userSockets.get(data.to);
                if (targetSocketId) {
                    this.io
                        .to(targetSocketId)
                        .emit("call_accepted", data.signal);
                }
            });

            socket.on("end_call", (data: { to: string }) => {
                const targetSocketId = this.userSockets.get(data.to);
                if (targetSocketId) {
                    this.io.to(targetSocketId).emit("call_ended");
                }
            });

            // Handle disconnection
            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.username}`);
                if (socket.userId) {
                    this.userSockets.delete(socket.userId);
                }
                this.socketUsers.delete(socket.id);
            });
        });
    }

    // Public methods to be used in other parts of the application
    public getUserSocket(userId: string): string | undefined {
        return this.userSockets.get(userId);
    }

    public getSocketUser(socketId: string): string | undefined {
        return this.socketUsers.get(socketId);
    }

    public getIO(): SocketServer {
        return this.io;
    }
}

export default SocketService;
