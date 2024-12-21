import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RedisClient } from "../db/redisClient";

type TJwtPayload = {
    userId: string;
} & JwtPayload;

export const authenticateToken = async (
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

    const redisClient = await RedisClient.getInstance().getConnection();
    if (!redisClient) throw new Error("Could not fetch data.");

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TJwtPayload;
        const userId = await redisClient.get(`JWT:${decoded.jti}`);
        if (!userId) throw new Error("Invalid token");
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(403).json({ status: 403, error: "Invalid token" });
    }
};
