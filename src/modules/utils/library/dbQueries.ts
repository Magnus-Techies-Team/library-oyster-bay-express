import { Tables } from "../../../db/types/tables";
import { RBACColumns } from "../../../db/types/tableColumns/rbac";
import { AccessLevel } from "../../../db/types/customTypes";
import { UsersColumns } from "../../../db/types/tableColumns/users";

export const addUserToOrganizationQuery = (
  userId: number,
  organizationId: number
) => {
  return `
INSERT INTO ${Tables.rbac} 
    (${RBACColumns.user_id}, ${RBACColumns.library_id}, ${RBACColumns.role_id}) 
VALUES 
    (${userId}, ${organizationId}, ${AccessLevel.USER})
    `;
};

export const setUserRoleToOrganizationOwnerQuery = (
  userId: number,
  organizationId: number
) => {
  return `
  INSERT INTO ${Tables.rbac}
    (${RBACColumns.user_id}, ${RBACColumns.library_id}, ${RBACColumns.role_id})
    VALUES
        (${userId}, ${organizationId}, ${AccessLevel.OWNER})
  `;
};

export const getUserOrganizationsQuery = (userId: number) => {
  return `select ${RBACColumns.library_id} from ${Tables.rbac} where ${RBACColumns.user_id} = ${userId}`;
};

export const getUsersInLibraryListQuery = (organizationId: number) => {
  return `select ${Tables.users}.* from ${Tables.rbac} 
             join ${Tables.users}
             on ${RBACColumns.user_id} = ${Tables.users}.${UsersColumns.id}
             where ${RBACColumns.library_id} = ${organizationId}`;
};
