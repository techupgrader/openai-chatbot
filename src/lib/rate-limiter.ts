import { redis } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * This code exports a rate limiter instance created using the `Ratelimit` class from the `@upstash/ratelimit` library.
 * The rate limiter is configured to use Redis as the storage backend and a sliding window algorithm with a window size of 10 seconds and a limit of 4 requests per window.
 * The `prefix` option is used to set a custom prefix for the Redis keys used by the rate limiter, which can be useful to avoid key collisions when sharing a Redis instance with other applications.
 * The exported `rateLimiter` constant can be used to rate limit incoming requests in a Node.js application.
 */
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(4, "60 s"),
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});
