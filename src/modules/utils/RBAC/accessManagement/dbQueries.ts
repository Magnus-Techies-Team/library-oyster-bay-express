import { Tables } from "../../../../db/types/tables";
import { RBACColumns } from "../../../../db/types/tableColumns/rbac";
import { RolesColumns } from "../../../../db/types/tableColumns/roles";

export const getAccessLevel = (userId: number, organizationId: number) => {
  return `SELECT * FROM ${Tables.rbac} 
    join ${Tables.roles} 
        on ${Tables.rbac}.${RBACColumns.role_id} = ${Tables.roles}.${RolesColumns.id} 
         WHERE ${RBACColumns.user_id} = ${userId} AND ${RBACColumns.library_id} = ${organizationId}`;
};
