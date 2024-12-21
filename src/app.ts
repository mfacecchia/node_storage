import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileRoutes from "./routes/fileRoutes";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
