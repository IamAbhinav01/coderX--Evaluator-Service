import { Queue, RedisConnection } from 'bullmq';
import redisConnection from '../config/redis.config';

export const SampleQueue = new Queue('SampleQueue', {
  connection: redisConnection,
});
export const emailQueue = new Queue('emailQueue', {
  connection: redisConnection,
});
export const paymentQueue = new Queue('paymentQueue', {
  connection: redisConnection,
});
