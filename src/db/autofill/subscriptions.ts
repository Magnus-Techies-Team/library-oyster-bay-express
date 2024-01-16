import { Tables } from "../types/tables";
import { SubscriptionsColumns } from "../types/tableColumns/subscriptions";

const autofillSubscriptionsQuery = `
    insert into ${Tables.subscriptions} (${SubscriptionsColumns.id}, ${SubscriptionsColumns.price}, 
                       ${SubscriptionsColumns.organization_limit_number}, 
                       ${SubscriptionsColumns.file_size_limit_number})
    values
        (1, 0, 1, 1000),
        (2, 100, 10, 100*1024),
        (3, 1000, 100, 1000*1024)
    on conflict do nothing;
  `;

export default autofillSubscriptionsQuery;
