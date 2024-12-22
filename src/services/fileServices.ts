import { File } from "@prisma/client";
import { FileDAO } from "../dao/fileDao";
import { NotFoundError } from "../errors/custom.errors";

export class FileServices {
    private fileDao = new FileDAO();

    async uploadFile(
        file: Express.Multer.File,
        user_id: File["user_id"],
        class_id: File["class_id"]
    ) {
        const resFile = await this.fileDao.createFile({
            filename: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            user_id,
            class_id,
        });
        return this.serializeFileId([resFile])[0];
    }

    async getFilesList(user_id: File["user_id"], class_id?: File["class_id"]) {
        const filesList = await this.fileDao.findFiles(
            user_id,
            class_id ? parseInt(class_id.toString()) : undefined
        );
        return this.serializeFileId(filesList);
    }

    async getSingleFile(filename: File["filename"], user_id: File["user_id"]) {
        const file = await this.fileDao.findFileByFilenameAndUserId(
            filename,
            user_id
        );
        if (!file) throw new NotFoundError("File not found");
        return this.serializeFileId([file])[0];
    }

    async deleteFileById(file_id: File["id"], user_id: File["user_id"]) {
        await this.fileDao.deleteFileById(file_id, user_id);
    }

    async deleteFileByFilename(
        filename: File["filename"],
        user_id: File["user_id"]
    ) {
        const file = await this.getSingleFile(filename, user_id);
        await this.fileDao.deleteFileById(BigInt(file.id), user_id);
    }

    private serializeFileId(filesList: File[]) {
        return filesList.map((file) => {
            return {
                ...file,
                id: file.id.toString(),
            };
        });
    }
}
