import { NextFunction, Request, Response } from "express";
import { FileDAO } from "../dao/fileDao";
import {
    GenericAppError,
    NotAuthenticatedError,
    NotFoundError,
} from "../errors/custom.errors";

const fileDao = new FileDAO();

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
        const { file: reqFile, userId } = req;
        if (!reqFile || !userId) {
            throw new GenericAppError(
                "No file uploaded or user not authenticated",
                400
            );
        }

        const file = await fileDao.createFile({
            filename: reqFile.originalname,
            path: reqFile.path,
            mimetype: reqFile.mimetype,
            size: reqFile.size,
            user_id: parseInt(userId),
            class_id: parseInt(req.body.class_id),
        });
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
        const { userId } = req;
        const { class_id } = req.body;
        if (!sendResponseOnUnauthorized(userId)) return;
        const files = await fileDao.findFiles(
            parseInt(userId!),
            class_id ? parseInt(class_id) : undefined
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
        const { userId } = req;
        if (!sendResponseOnUnauthorized(userId)) return;
        const file = await fileDao.findFileByFilenameAndUserId(
            req.params.filename,
            parseInt(userId)
        );
        if (!file) {
            throw new NotFoundError("File not found");
        }
        await fileDao.deleteFileById(file.id);
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
        const { filename, user_id: userId } = req.params;
        if (!filename || !userId) {
            throw new GenericAppError("File name or user not provided", 400);
        }
        if (!sendResponseOnUnauthorized(userId)) return;
        const file = await fileDao.findFileByFilenameAndUserId(
            filename,
            parseInt(userId)
        );
        if (!file) {
            throw new NotFoundError("File not found");
        }
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
