import { File, PrismaClient } from "@prisma/client";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { DatabaseQueryError, NotFoundError } from "../errors/custom.errors";

const prisma = new PrismaClient();

export class FileDAO {
    async createFile(data: Omit<File, "id" | "shared_at">) {
        try {
            return await prisma.file.create({ data });
        } catch (err) {
            if (err instanceof PrismaClientValidationError) {
                throw new DatabaseQueryError(
                    "Invalid or missing required data"
                );
            }
            throw err;
        }
    }

    async findFiles(userId: File["user_id"], classId?: File["class_id"]) {
        return await prisma.file.findMany({
            where: {
                user_id: userId,
                class_id: classId,
            },
        });
    }

    async findFileByFilenameAndUserId(
        filename: File["filename"],
        userId: File["user_id"]
    ) {
        return await prisma.file.findFirst({
            where: {
                filename,
                user_id: userId,
            },
        });
    }

    async deleteFileById(fileId: File["id"]) {
        try {
            return await prisma.file.delete({
                where: {
                    id: fileId,
                },
            });
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code == "P2025") {
                    throw new NotFoundError("File does not exist");
                }
            }
            throw err;
        }
    }
}
