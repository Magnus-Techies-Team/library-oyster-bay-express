import { Tables } from "../../../db/types/tables";
import { PublicationColumns } from "../../../db/types/tableColumns/publications";

export const getOrganizationPublicationByIdAndOrganizationQuery = (
  id: number,
  organizationId: number
) => {
  return `
        select * from ${Tables.publications} where ${PublicationColumns.id} = ${id} and ${PublicationColumns.library_id} = ${organizationId}`;
};

export const setPublicationVisibilityByIdAndOrganizationQuery = (
  publicationId: number,
  organizationId: number,
  isPublic: boolean
) => {
  return `
        update ${Tables.publications} set ${PublicationColumns.is_public} = ${isPublic} where ${PublicationColumns.id} = ${publicationId}`;
};

export const setPublicationApprovalByIdAndOrganizationQuery = (
  publicationId: number,
  organizationId: number,
  isApproved: boolean
) => {
  return `
        update ${Tables.publications} set ${PublicationColumns.is_approved} = ${isApproved} where ${PublicationColumns.library_id} = ${organizationId} and ${PublicationColumns.id} = ${publicationId}`;
};

export const getUserPublications = (userId: number, organizationId: number) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.user_id} = ${userId} and ${PublicationColumns.library_id} = ${organizationId}`;
};

export const getOrganizationPublicationsQuery = (organizationId: number) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.library_id} = ${organizationId} and ${PublicationColumns.is_public} = true and ${PublicationColumns.is_approved} = true`;
};

export const getOrganizationHiddenPublicationsByUserIdQuery = (
  userId: number
) => {
  return `
        select * from ${Tables.publications} where ${PublicationColumns.user_id} = ${userId} and ${PublicationColumns.is_public} = false`;
};

export const getAllOrganizationsPublicationsQuery = (
  organizationId: number
) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.library_id} = ${organizationId}`;
};

export const getOrganizationsHiddenPublicationsQuery = (
  organizationId: number
) => {
  return `
    select * from ${Tables.publications} where ${PublicationColumns.library_id} = ${organizationId} and ${PublicationColumns.is_public} = false`;
};
