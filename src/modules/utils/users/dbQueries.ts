import { Tables } from "../../../db/types/tables";
import { SubscriptionsUsersColumns } from "../../../db/types/tableColumns/subscriptionsUsers";
import { LibraryColumns } from "../../../db/types/tableColumns/libraries";
import { RBACColumns } from "../../../db/types/tableColumns/rbac";
import { AccessLevel } from "../../../db/types/customTypes";

export const getUserSubscriptionQuery = (userId: number) => {
  return `select * from ${Tables.subscriptions_users}
                          join ${Tables.subscriptions}
                               on ${SubscriptionsUsersColumns.subscription_id} = ${Tables.subscriptions}.id
         where ${SubscriptionsUsersColumns.user_id} = ${userId} 
    `;
};

export const getUserOrganizationsQuery = (userId: number) => {
  return `select * from ${Tables.libraries} where ${LibraryColumns.owner_id} = ${userId}`;
};

export const setBasicRoleQuery = (userId: number) => {
  return `INSERT INTO ${Tables.rbac} 
            (${RBACColumns.user_id}, ${RBACColumns.library_id}, ${RBACColumns.role_id}) 
        VALUES 
            (${userId}, 0, ${AccessLevel.USER})`;
};

export const setBasicSubscriptionQuery = (userId: number) => {
  return `INSERT INTO ${Tables.subscriptions_users} 
        (${SubscriptionsUsersColumns.user_id}, ${SubscriptionsUsersColumns.subscription_id})
    VALUES
        (${userId}, 1)`;
};
