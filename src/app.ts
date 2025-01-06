import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./errors/errorHandler.errors";
import fileRoutes from "./routes/fileRoutes";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:8000",
    })
);

app.set("x-powered-by", false);
app.use(express.json());
app.use("/api", fileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
