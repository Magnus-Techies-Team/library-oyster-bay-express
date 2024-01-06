import { Tables } from "../../../db/types/tables";
import { RBACColumns } from "../../../db/types/tableColumns/rbac";
import { AccessLevel } from "../../../db/types/customTypes";

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
