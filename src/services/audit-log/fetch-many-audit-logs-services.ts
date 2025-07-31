import prisma from '../../../lib/prisma';
import redis from '../../../lib/redis';

export async function fetchManyAuditLogsServices() {
  const redisKey = 'audit-logs';

  const cached = await redis.get(redisKey);

  if (cached) return JSON.parse(cached);

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { created_at: 'desc' },
  });

  const extime = 24 * 60 * 60 * 1000;

  if (auditLogs.length > 0) {
    await redis.set(redisKey, JSON.stringify(auditLogs), 'EX', extime);
  }

  return auditLogs;
}
