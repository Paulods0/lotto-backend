import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { ActionType } from '@prisma/client';

export type Actions = ActionType | 'manage';
export type Subjects = 'Agents' | 'Terminals' | 'Pos' | 'Licences' | 'Sim Cards' | 'all';

export type AppAbillity = MongoAbility<[Actions, Subjects]>;

export function defineAbillityFor(permissions: Array<{ action: Actions; feature: Subjects }>) {
  const { can, build } = new AbilityBuilder<AppAbillity>(createMongoAbility);

  for (const perm of permissions) {
    can(perm.action, perm.feature);
  }

  return build();
}
