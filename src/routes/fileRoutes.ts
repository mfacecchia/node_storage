import { Router } from "express";
import multer from "multer";
import path from "path";
import {
    deleteFile,
    getFile,
    listFiles,
    uploadFile,
} from "../controllers/fileController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post("/upload", authenticateToken, upload.single("file"), uploadFile);
router.get("/files", authenticateToken, listFiles);
router.get("/files/:userId", getFile);
router.delete("/delete", authenticateToken, deleteFile);

export default router;
