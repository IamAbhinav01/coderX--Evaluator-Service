import { Redis } from 'ioredis';
import serverConfig from './server.config';

const redisConnection = new Redis({
  host: serverConfig.REDIS_HOST,
  port: serverConfig.REDIS_PORT,
  maxRetriesPerRequest: null,
});
export default redisConnection;
