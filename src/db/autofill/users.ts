import { Tables } from "../types/tables";
import { UsersColumns } from "../types/tableColumns/users";

const autofillUsersQuery = `
    insert into ${Tables.users} (${UsersColumns.id}, ${UsersColumns.first_name}, ${UsersColumns.last_name}, ${UsersColumns.email}, ${UsersColumns.password})
    values
        (0, 'Basic', 'User', 'basic.user@gmail.com', 'F56RsnvsL8r5ut2dgY9B9Ao0JnDqCRKKFefeU5OTVso=')
    on conflict do nothing;
  `;

export default autofillUsersQuery;
