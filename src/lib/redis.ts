import { Redis } from "@upstash/redis";

/**
 * This code is exporting a Redis instance created using the `@upstash/redis` package.
 * The Redis instance is configured with a URL and token obtained from environment variables `REDIS_URL` and
 * `REDIS_SECRET` respectively.
 * This Redis instance can be used to interact with a Upstash Redis server.
 */
export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_SECRET!,
});
