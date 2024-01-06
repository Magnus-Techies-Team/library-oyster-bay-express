import { Tables } from "../../../db/types/tables";
import { SubscriptionsUsersColumns } from "../../../db/types/tableColumns/subscriptionsUsers";
import { LibraryColumns } from "../../../db/types/tableColumns/libraries";

export const getUserSubscriptionQuery = (userId: number) => {
  return `select * from ${Tables.subscriptions_users} 
    where ${SubscriptionsUsersColumns.user_id} = ${userId} 
    join ${Tables.subscriptions} 
    on ${SubscriptionsUsersColumns.subscription_id} = ${Tables.subscriptions}.id`;
};

export const getUserOrganizationsQuery = (userId: number) => {
  return `select * from ${Tables.libraries} where ${LibraryColumns.owner_id} = ${userId}`;
};
