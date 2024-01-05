import { Tables } from "./types/tables";
import { PublicationColumns } from "./types/tableColumns/publications";
import { PublicationTagsColumns } from "./types/tableColumns/publicationTags";
import { LibraryColumns } from "./types/tableColumns/libraries";
import { RBACColumns } from "./types/tableColumns/rbac";
import { RoleColumns } from "./types/tableColumns/roles";
import { UserColumns } from "./types/tableColumns/users";
import { PerUserOrganizationFileLimitsColumns } from "./types/tableColumns/perUserOrganizationFileLimits";
import { SubscriptionsColumns } from "./types/tableColumns/subscriptions";
import { SubscriptionsUsersColumns } from "./types/tableColumns/subscriptionsUsers";

export const createPublicationTagsQuery = `create table if not exists ${Tables.publication_tags} (
    ${PublicationTagsColumns.id} serial primary key,
    ${PublicationTagsColumns.publication_id} integer not null,
    ${PublicationTagsColumns.tag_id} integer not null,
    ${PublicationTagsColumns.created_at} timestamp not null default current_timestamp,
    ${PublicationTagsColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createPublicationQuery = `create table if not exists ${Tables.publications} (
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

export const createLibraryQuery = `create table if not exists ${Tables.libraries} (
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
        ${RBACColumns.updated_at} timestamp not null default current_timestamp,
        PRIMARY KEY (${RBACColumns.library_id}, ${RBACColumns.user_id}, ${RBACColumns.role_id})
);`;

export const createRolesQuery = `create table if not exists ${Tables.roles} (
    ${RoleColumns.id} serial primary key,
    ${RoleColumns.title} varchar(255) not null,
    ${RoleColumns.access_level} integer not null,
    ${RoleColumns.created_at} timestamp not null default current_timestamp,
    ${RoleColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createUsersQuery = `create table if not exists ${Tables.users} (
    ${UserColumns.id} serial primary key,
    ${UserColumns.first_name} varchar(255) not null,
    ${UserColumns.last_name} varchar(255) not null,
    ${UserColumns.email} varchar(255) not null,
    ${UserColumns.password} varchar(255) not null,
    ${UserColumns.created_at} timestamp not null default current_timestamp,
    ${UserColumns.updated_at} timestamp not null default current_timestamp
);`;

export const createSubscriptionsQuery = `
CREATE TABLE IF NOT EXISTS ${Tables.subscriptions} (
    id SERIAL PRIMARY KEY,
    ${SubscriptionsColumns.organization_limit_number} INTEGER NOT NULL,
    ${SubscriptionsColumns.price} INTEGER NOT NULL,
    ${SubscriptionsColumns.file_size_limit_number} INTEGER NOT NULL,
    ${SubscriptionsColumns.created_at} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${SubscriptionsColumns.updated_at} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

export const createPerUserOrganizationFileLimitsQuery = `
CREATE TABLE IF NOT EXISTS ${Tables.per_user_organization_file_limits} (
    ${PerUserOrganizationFileLimitsColumns.id} SERIAL PRIMARY KEY,
    ${PerUserOrganizationFileLimitsColumns.user_id} INTEGER NOT NULL,
    ${PerUserOrganizationFileLimitsColumns.organization_id} INTEGER NOT NULL,
    ${PerUserOrganizationFileLimitsColumns.file_size_limit} INTEGER NOT NULL,
    ${PerUserOrganizationFileLimitsColumns.created_at} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${PerUserOrganizationFileLimitsColumns.updated_at} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (${PerUserOrganizationFileLimitsColumns.user_id}) REFERENCES ${Tables.users}(${UserColumns.id}),
    FOREIGN KEY (${PerUserOrganizationFileLimitsColumns.organization_id}) REFERENCES ${Tables.libraries}(${LibraryColumns.id})
);`;

export const createSubscriptionsUsersQuery = `
CREATE TABLE IF NOT EXISTS ${Tables.subscriptions_users} (
    ${SubscriptionsUsersColumns.subscription_id} INTEGER NOT NULL,
    ${SubscriptionsUsersColumns.user_id} INTEGER NOT NULL,
    ${SubscriptionsUsersColumns.created_at} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${SubscriptionsUsersColumns.updated_at} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (${SubscriptionsUsersColumns.subscription_id}, ${SubscriptionsUsersColumns.user_id}),
    FOREIGN KEY (${SubscriptionsUsersColumns.subscription_id}) REFERENCES ${Tables.subscriptions}(${SubscriptionsColumns.id}),
    FOREIGN KEY (${SubscriptionsUsersColumns.user_id}) REFERENCES ${Tables.users}(${UserColumns.id})
);`;
