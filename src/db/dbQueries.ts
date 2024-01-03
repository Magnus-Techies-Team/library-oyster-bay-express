import { Tables } from "./types/tables";
import { PublicationColumns } from "./types/tableColumns/publication";
import { PublicationTagsColumns } from "./types/tableColumns/publicationTags";
import { LibraryColumns } from "./types/tableColumns/library";
import { RBACColumns } from "./types/tableColumns/rbac";
import { RoleColumns } from "./types/tableColumns/role";
import { UserColumns } from "./types/tableColumns/user";

export const createPublicationTagsQuery = `create table if not exists ${Tables.publication_tags} (
    ${PublicationTagsColumns.id} serial primary key,
    ${PublicationTagsColumns.publication_id} integer not null,
    ${PublicationTagsColumns.tag_id} integer not null,
    ${PublicationTagsColumns.created_at} timestamp not null default current_timestamp,
    ${PublicationTagsColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createPublicationQuery = `create table if not exists ${Tables.publication} (
    ${PublicationColumns.id} serial primary key,
    ${PublicationColumns.title} varchar(255) not null,
    ${PublicationColumns.filepath} varchar(255) not null,
    ${PublicationColumns.user_id} integer not null,
    ${PublicationColumns.library_id} integer not null,
    ${PublicationColumns.is_public} boolean not null default false,
    ${PublicationColumns.price} integer not null default 1,
    ${PublicationColumns.year} integer not null default 2020,
    ${PublicationColumns.created_at} timestamp not null default current_timestamp,
    ${PublicationColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createLibraryQuery = `create table if not exists ${Tables.library} (
    ${LibraryColumns.id} serial primary key,
    ${LibraryColumns.name} varchar(255) not null,
    ${LibraryColumns.owner_id} integer not null,
    ${LibraryColumns.description} text,
    ${LibraryColumns.created_at} timestamp not null default current_timestamp,
    ${LibraryColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createRBACQuery = `create table if not exists ${Tables.rbac} (
        ${RBACColumns.library_id} integer not null,
        ${RBACColumns.user_id} integer not null,
        ${RBACColumns.role_id} integer not null,
        ${RBACColumns.created_at} timestamp not null default current_timestamp,
        ${RBACColumns.updated_at} timestamp not null default current_timestamp
        UNIQUE (${RBACColumns.library_id}, ${RBACColumns.user_id}, ${RBACColumns.role_id})
);`;

export const createRolesQuery = `create table if not exists ${Tables.role} (
    ${RoleColumns.id} serial primary key,
    ${RoleColumns.title} varchar(255) not null,
    ${RoleColumns.access_level} integer not null,
    ${RoleColumns.created_at} timestamp not null default current_timestamp,
    ${RoleColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createUsersQuery = `create table if not exists ${Tables.user} (
    ${UserColumns.id} serial primary key,
    ${UserColumns.first_name} varchar(255) not null,
    ${UserColumns.last_name} varchar(255) not null,
    ${UserColumns.email} varchar(255) not null,
    ${UserColumns.password} varchar(255) not null,
    ${UserColumns.created_at} timestamp not null default current_timestamp,
    ${UserColumns.updated_at} timestamp not null default current_timestamp
);`;
