import prisma from '../../lib/prisma';

type AccType = { feature_id: number; actions: string[] };

export async function fetchManyGroupsService() {
  const groups = await prisma.group.findMany({ include: { permissions: true, users: true } });

  return groups.map(group => ({
    ...group,
    permissions: group.permissions.reduce((acc, permission) => {
      const existing = acc.find(p => p.feature_id === permission.feature_id);
      if (existing) {
        existing.actions.push(permission.action);
      } else {
        acc.push({
          feature_id: permission.feature_id,
          actions: [permission.action],
        });
      }
      return acc;
    }, [] as AccType[]),
  }));
}
