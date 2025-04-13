import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import httpStatus from "http-status";

// Extend Express Request type to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json(errorResponse("Authentication required"));
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
        };

        // Attach userId to request object
        req.userId = decoded.id;

        next();
    } catch (error) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json(errorResponse("Invalid or expired token"));
    }
};
