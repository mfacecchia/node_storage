import { createClient, RedisClientType } from "redis";
import { RedisConnectionError } from "../errors/custom.errors";

export class RedisClient {
    private connectionUrl = process.env.REDIS_CONNECTION_STRING;
    private client: RedisClientType | null = null;
    private maxReconnectionAttempts = 25;
    private currentReconnectionAttempts = 0;
    static instance: RedisClient | null = null;

    private constructor() {
        this.connect();
    }

    static getInstance() {
        if (!(this.instance instanceof RedisClient)) {
            this.instance = new RedisClient();
        }
        return this.instance;
    }

    /**
     * Opens up a new connection with Redis server
     */
    private async connect() {
        // NOTE: Connecting or already connected
        if (this.client?.isReady) {
            return;
        }

        // TODO: Convert this to pooled connections client
        this.client = createClient({
            url: this.connectionUrl,
        });

        await this.client
            .on("connect", async () => {})
            .on("error", (err) => {})
            .on("end", () => {})
            .on("reconnecting", () => {
                if (!this.hasReachedMaxRetries()) {
                    this.currentReconnectionAttempts += 1;
                    return;
                }
                this.currentReconnectionAttempts = 0;
                this.client = null;
                throw new RedisConnectionError(
                    "Could not establish connection to Database"
                );
            })
            .connect();
    }

    async getConnection() {
        this.currentReconnectionAttempts = 0;
        if (!this.client || !this.client.isReady) await this.connect();
        return this.client;
    }

    private hasReachedMaxRetries() {
        return this.currentReconnectionAttempts >= this.maxReconnectionAttempts;
    }
}
