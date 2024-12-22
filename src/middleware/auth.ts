import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { RedisClient } from "../db/redisClient";
import { DataFetchError, TokenValidationError } from "../errors/custom.errors";

type TJwtPayload = {
    userId: string;
} & JwtPayload;

export const authenticateToken = async (
    req: Request & { userId?: string },
    res: Response,
    next: NextFunction
) => {
    try {
        const { authorization: authToken } = req.headers;
        const token = authToken?.replace("Bearer ", "");
        if (!authToken || !token)
            throw new TokenValidationError(
                "Authorization token not found or invalid value provided"
            );

        const redisClient = await RedisClient.getInstance().getConnection();
        if (!redisClient) throw new DataFetchError("Could not fetch data.");
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TJwtPayload;
        const userId = await redisClient.get(`JWT:${decoded.jti}`);
        if (!userId) throw new TokenValidationError("Invalid token");
        // TODO: Replace with `user_id` to match DB field
        req.userId = userId;
        next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            next(new TokenValidationError("Invalid authorization token"));
            return;
        }
        next(err);
    }
};
