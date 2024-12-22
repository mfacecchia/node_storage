import { NextFunction, Request, Response } from "express";
import {
    GenericAppError,
    NotAuthenticatedError,
} from "../errors/custom.errors";
import { FileServices } from "../services/fileServices";

const fileServices = new FileServices();

type TAuthenticatedRequest = Request & {
    userId?: string;
};

export const uploadFile = async (
    req: TAuthenticatedRequest & {
        file?: Express.Multer.File;
    },
    res: Response,
    next: NextFunction
) => {
    try {
        const { file: reqFile, userId: user_id } = req;
        const { class_id } = req.body;
        if (!reqFile || !user_id) {
            throw new GenericAppError(
                "No file uploaded or user not authenticated",
                400
            );
        }
        const file = await fileServices.uploadFile(
            reqFile,
            parseInt(user_id),
            parseInt(class_id)
        );
        res.status(201).json({
            status: 201,
            message: "File uploaded successfully",
            data: {
                ...file,
                id: file.id.toString(),
            },
        });
    } catch (err) {
        next(err);
    }
};

export const listFiles = async (
    req: TAuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId: user_id } = req;
        const { class_id } = req.query;
        if (!sendResponseOnUnauthorized(user_id)) return;
        const files = await fileServices.getFilesList(
            parseInt(user_id),
            class_id ? parseInt(class_id.toString()) : undefined
        );
        res.status(200).json(files);
    } catch (err) {
        next(err);
    }
};

export const deleteFile = async (
    req: TAuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId: user_id } = req;
        const { filename } = req.query;
        if (!filename) throw new GenericAppError("Filename not provided", 400);
        if (!sendResponseOnUnauthorized(user_id)) return;
        await fileServices.deleteFileByFilename(
            filename.toString(),
            parseInt(user_id)
        );
        res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
        next(err);
    }
};

export const getFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;
        const { filename } = req.query;
        if (!filename || !userId) {
            throw new GenericAppError("Filename or user not provided", 400);
        }
        if (!sendResponseOnUnauthorized(userId)) return;
        const file = await fileServices.getSingleFile(
            filename.toString(),
            parseInt(userId)
        );
        res.sendFile(file.path, { root: "./" });
    } catch (err) {
        next(err);
    }
};

function sendResponseOnUnauthorized(userId?: string): userId is string {
    if (!userId) {
        throw new NotAuthenticatedError("User not authenticated");
    }
    return typeof userId === "string";
}
