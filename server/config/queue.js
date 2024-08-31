export const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};

export const defaultQueueConfig =
{
    delay: 5000,
    removeOnComplete: {
        count: 100,
        age: 60 * 60 * 24,
    },
    attempts: {
        max: 3,  // max 3 retry
    },
    backoff: {
        type: "exponential",
        delay: 1000,  // 1st try-> 1sec delay, 2ndtry -> 2sec delay, 3rd try -> 3sec delay
    },
    removeOnFail: {
        count: 1000,
    }
}
