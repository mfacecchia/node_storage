import { File, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FileDAO {
    async createFile(data: Omit<File, "id" | "shared_at">) {
        return await prisma.file.create({ data });
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
        return await prisma.file.delete({
            where: {
                id: fileId,
            },
        });
    }
}
