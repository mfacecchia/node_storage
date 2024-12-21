import { createClient, RedisClientType } from "redis";

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
        this.currentReconnectionAttempts = 0;

        // TODO: Convert this to pooled connections client
        this.client = createClient({
            url: this.connectionUrl,
        });

        await this.client
            .on("connect", async () => {
                this.currentReconnectionAttempts = 0;
            })
            .on("error", (err) => {
                if (err.code === "ECONNREFUSED") {
                    if (this.hasReachedMaxRetries())
                        throw new Error("Too many connection attempts.");
                }
            })
            .on("end", () => {})
            .on("reconnecting", () => {
                this.currentReconnectionAttempts += 1;
            })
            .connect();
    }

    async getConnection() {
        if (!this.client || this.client.isReady) await this.connect();
        return this.client;
    }

    private hasReachedMaxRetries() {
        return this.currentReconnectionAttempts >= this.maxReconnectionAttempts;
    }
}
