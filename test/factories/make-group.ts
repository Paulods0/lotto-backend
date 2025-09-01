import { CreateGroupDTO } from '../../src/features/group/schemas/create.schema';

export function makeGroup(override?: Partial<CreateGroupDTO>): CreateGroupDTO {
  return {
    name: 'Development',
    description: 'Development group',
    permissions: [
      {
        module: 'AGENT',
        actions: ['READ', 'CREATE', 'DELETE'],
      },
      {
        module: 'TERMINAL',
        actions: ['READ', 'UPDATE'],
      },
    ],
    ...override,
  } as CreateGroupDTO;
}
