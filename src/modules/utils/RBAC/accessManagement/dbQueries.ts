import { Tables } from "../../../../db/types/tables";
import { RBACColumns } from "../../../../db/types/tableColumns/rbac";

export const getAccessLevel = (userId: number, organizationId: number) => {
  return `SELECT * FROM ${Tables.rbac} WHERE ${RBACColumns.user_id} = ${userId} AND ${RBACColumns.library_id} = ${organizationId} join ${Tables.role} on ${Tables.rbac}.${RBACColumns.role_id} = ${Tables.role}.id`;
};
