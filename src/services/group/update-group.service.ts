import { ActionType } from '@prisma/client';
import { NotFoundError } from '../../errors';
import prisma from '../../lib/prisma';
import { UpdateGroupDTO } from '../../validations/group/update.schema';

export async function updateGroup(data: UpdateGroupDTO) {
  return await prisma.$transaction(async tx => {
    const group = await tx.group.findUnique({
      where: { id: data.id },
    });

    if (!group) throw new NotFoundError('O grupo não foi encontrado');

    await tx.group.update({
      where: { id: group.id },
      data: {
        name: data.name,
        ...(data.permissions && {
          permissions: {
            deleteMany: {},
            create: data.permissions.flatMap(p =>
              p.actions.map(action => ({
                feature_id: p.feature_id,
                action: action as ActionType,
              }))
            ),
          },
          ...(data.users_id && {
            users: {
              connect: data.users_id.map(userId => ({
                user_id: userId,
              })),
            },
          }),
        }),
      },
    });
  });
}
