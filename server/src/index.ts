import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger.json");
import router from "./routers";
import SocketService from "./services/socket.service";
import { createServer } from "http";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8800;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL || "mongodb://localhost:27017/social-media")
    .then(() => {
        console.log("Connected to MongoDB");
        // Initialize Socket.IO
        const socketService = new SocketService(httpServer);

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(helmet());
        app.use(morgan("common"));

        // Routes
        app.get("/", (req, res) => {
            res.send("Welcome to the Social Media API - TypeScript Version");
        });

        // API Routes
        app.use("/api", router);

        // Swagger UI setup
        app.use("/api-docs", swaggerUi.serve as any);
        app.get("/api-docs", swaggerUi.setup(swaggerDocument) as any);

        // Start server
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
