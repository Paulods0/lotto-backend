import { Actions, defineAbillityFor, Subjects } from '.';
import { getUserPermissions } from '../services/auth/get-user-permissions';

export async function buildUserAbillity(userId: string) {
  const rawPermissions = await getUserPermissions(userId);

  const permissions = rawPermissions.map(p => ({
    action: p.action.toLowerCase() as Actions,
    feature: p.feature as Subjects,
  }));

  return defineAbillityFor(permissions);
}
