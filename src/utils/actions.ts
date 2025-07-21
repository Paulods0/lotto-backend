export type Action = {
  create:string
  delete:string
  edit:string
}

export const action:Action = {
  create:"create",
  delete: "delete",
  edit: "edit",
} as const