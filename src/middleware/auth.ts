import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
}

export const authenticateToken = (
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) => {
    const { sessionId: token } = req.cookies;

    if (!token) {
        return res
            .status(401)
            .json({ status: 401, message: "Authorization token not provided" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};
