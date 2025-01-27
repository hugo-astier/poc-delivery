import { createClient } from 'redis';

const redis = createClient();

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

await redis.connect(); // Connect Redis

export default redis;
