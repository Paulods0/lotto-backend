import { action } from "./actions";

const roles = {
  dev: [action.create, action.delete, action.edit],
  super_admin: [action.create, action.delete, action.edit],
  supervisor: [action.edit],
};

export default roles;