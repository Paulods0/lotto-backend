import redis from '../lib/redis';

export default async function deleteKeysByPattern(pattern: string) {
  const stream = redis.scanStream({ match: pattern });
  const keysToDelete: string[] = [];

  for await (const keys of stream) {
    keysToDelete.push(...keys);
  }

  if (keysToDelete.length > 0) {
    await redis.del(...keysToDelete);
  }
}
