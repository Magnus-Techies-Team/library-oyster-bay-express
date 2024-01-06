import {
  createLibrariesQuery,
  createPublicationTagsQuery,
  createRBACQuery,
  createPublicationsQuery,
  createRolesQuery,
  createUsersQuery,
  createSubscriptionsQuery,
  createPerUserOrganizationFileLimitsQuery,
  createSubscriptionsUsersQuery,
} from "./dbQueries";
import { getInstanceByToken } from "fastify-decorators";
import { DB, DBToken } from "./DBService";

export const initLocalDatabaseIfNotExists = async () => {
  const queryToExecute = `
    ${createLibrariesQuery}
    ${createRBACQuery}
    ${createPublicationTagsQuery}
    ${createPublicationsQuery}
    ${createRolesQuery}
    ${createUsersQuery}
    ${createSubscriptionsQuery}
    ${createPerUserOrganizationFileLimitsQuery}
    ${createSubscriptionsUsersQuery}
    `;
  await getInstanceByToken<DB>(DBToken).executeQuery(queryToExecute);
};
