import { ChangeLog } from '../validations/audit-log-schemas/create-audit-log-schema';

export function diffObjects(before: Record<any, any>, after: Record<any, any>): ChangeLog {
  const beforeFiltered: Record<string, any> = {};
  const afterFiltered: Record<string, any> = {};

  for (let key in after) {
    if (before[key] !== after[key]) {
      beforeFiltered[key] = before[key];
      afterFiltered[key] = after[key];
    }
  }

  return {
    before: Object.keys(beforeFiltered).length ? beforeFiltered : null,
    after: Object.keys(afterFiltered).length ? afterFiltered : null,
  };
}
