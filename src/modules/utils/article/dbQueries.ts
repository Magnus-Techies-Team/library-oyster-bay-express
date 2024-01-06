import { Tables } from "../../../db/types/tables";
import { PublicationColumns } from "../../../db/types/tableColumns/publications";

export const getUserPublications = (userId: number, organizationId: number) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.user_id} = ${userId} and ${PublicationColumns.library_id} = ${organizationId}`;
};

export const getOrganizationPublicationsQuery = (organizationId: number) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.library_id} = ${organizationId} and ${PublicationColumns.is_public} = true`;
};

export const getAllOrganizationsPublicationsQuery = (
  organizationId: number
) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.library_id} = ${organizationId}`;
};

export const getHiddenOrganizationsPublicationsQuery = (
  organizationId: number
) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.library_id} = ${organizationId} and ${PublicationColumns.is_public} = false`;
};
