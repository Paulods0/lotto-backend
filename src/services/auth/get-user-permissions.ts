import prisma from '../../lib/prisma';

export async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      groups: {
        include: {
          group: {
            include: {
              permissions: {
                include: { feature: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return [];

  const permissions = user.groups.flatMap(group => group.group.permissions);

  return permissions.map(p => ({
    action: p.action,
    feature: p.feature.name,
  }));
}
