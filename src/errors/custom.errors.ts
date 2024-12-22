export default class AppError extends Error {
    name: string = "AppError";
    statusCode: number = 500;

    constructor(message: string) {
        super(message);
    }
}

export class GenericAppError extends AppError {
    constructor(
        message: string,
        statusCode: number,
        name: string | null = null
    ) {
        super(message);
        this.name = name ?? "GenericAppError";
        this.statusCode = statusCode;
    }
}

export class RedisConnectionError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "RedisConnectionError";
        this.statusCode = 500;
    }
}

export class DatabaseConnectionError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseConnectionError";
        this.statusCode = 500;
    }
}

export class DatabaseQueryError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseQueryError";
        this.statusCode = 400;
    }
}

export class DataFetchError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "DataFetchError";
        this.statusCode = 500;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

export class TokenValidationError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "TokenValidationError";
        this.statusCode = 401;
    }
}

export class NotAuthenticatedError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "NotAuthenticatedError";
        this.statusCode = 401;
    }
}

export class FileUploadError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "FileUploadError";
        this.statusCode = 400;
    }
}

export class ImageNotAvailableError extends AppError {
    constructor(message: string) {
        super(message);
        this.name = "ImageNotAvailableError";
        this.statusCode = 400;
    }
}
