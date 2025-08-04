import prisma from '../../lib/prisma';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function fetchManyAuditLogsServices() {
  const cacheKey = RedisKeys.auditLogs.all();

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { created_at: 'desc' },
  });

  if (auditLogs.length > 0) {
    await setCache(cacheKey, auditLogs);
  }

  return auditLogs;
}
