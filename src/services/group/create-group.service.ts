import prisma from '../../lib/prisma';
import { CreateGroupDTO } from '../../validations/group/create.schema';

export async function createGroupService(data: CreateGroupDTO) {
  return await prisma.group.create({
    data: {
      name: data.name,
      description: data.description,
      users: data.users_id
        ? {
            create: data.users_id.map(userId => ({
              user: { connect: { id: userId } },
            })),
          }
        : undefined,
      permissions: {
        create: data.permissions.flatMap(permission => {
          return permission.actions.map(action => ({
            feature_id: permission.feature_id,
            action,
          }));
        }),
      },
    },
    include: {
      permissions: true,
      users: { include: { user: true } },
    },
  });
}
