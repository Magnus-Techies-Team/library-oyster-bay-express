import { Tables } from "../types/tables";
import { LibraryColumns } from "../types/tableColumns/libraries";

const autofillLibrariesQuery = `
    insert into ${Tables.libraries} (${LibraryColumns.id}, ${LibraryColumns.owner_id}, ${LibraryColumns.description}, ${LibraryColumns.name})
    values 
        (0, 0, 'Platform Library. Needed for technical reasons.', 'Platform')
    on conflict do nothing;
`;

export default autofillLibrariesQuery;
