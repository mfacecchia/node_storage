import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import AppError, { DatabaseConnectionError } from "./custom.errors";

export async function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logError(err);
    if (err instanceof PrismaClientInitializationError) {
        err = new DatabaseConnectionError("Failed connection to database");
    }
    if (!(err instanceof AppError)) {
        res.status(400).json({
            status: 400,
            message: "An unexpected error occurred. Please try again later.",
        });
        return;
    }
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
    });
}

/**
 * Logs the caught `err` in the console if the app environment is 'development'
 * @param {Error} err
 */
export function logError(err: Error) {
    if (process.env.NODE_ENV !== "development") return;
    console.log("-------\n[ERROR]\n-------");
    console.error(err);
}
