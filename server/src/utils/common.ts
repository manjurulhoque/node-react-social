import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { errorResponse } from "../types/response";

// The 405 handler
const methodNotAllowed = (req: Request, res: Response, next: NextFunction) =>
    res
        .status(httpStatus.METHOD_NOT_ALLOWED)
        .json(errorResponse("Method not allowed"));

export { methodNotAllowed };
