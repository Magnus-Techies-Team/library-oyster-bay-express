import { Inject, Service } from "fastify-decorators";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import { BadRequestError } from "../../../server/utils/common/errors/error";
import { Tables } from "../../../db/types/tables";
import { LibraryColumns } from "../../../db/types/tableColumns/libraries";
import { LibrariesSchema } from "../../../db/types/tableSchemas/librariesSchema";
import fs from "fs";
import { RBACEnforce } from "../RBAC/hooks/rbacEnforcementHook";
import { AccessLevel } from "../../../db/types/customTypes";
import UserManager, { userManagerToken } from "../users/userManager";
import asyncStorage from "../RBAC/asyncStorage";
import { addUserToOrganizationQuery } from "./dbQueries";
import { RBACSchema } from "../../../db/types/tableSchemas/RBACSchema";
import { DB, DBToken } from "../../../db";

export const libraryManagerToken = Symbol("libraryManagerToken");

@Service(libraryManagerToken)
export default class LibraryManager {
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;

  @Inject(userManagerToken)
  private _userManager!: UserManager;

  @Inject(DBToken)
  private _DB!: DB;

  public async createLibrary(libraryData: {
    name: string;
    description: string;
    owner_id: number;
  }): Promise<LibrariesSchema> {
    const canCreateLibrary = await this.canCreateLibrary(libraryData.owner_id);
    if (!canCreateLibrary) {
      throw new BadRequestError(
        "Your subscription does not allow you to create more libraries",
        "LibraryManager"
      );
    }
    const library = await this._serviceClass.createRecord({
      tableName: Tables.libraries,
      columnObject: libraryData,
    });
    this.createLibraryFolder(library.rows[0].id);
    return library.rows[0];
  }

  @RBACEnforce(AccessLevel.USER)
  public async getLibrary(id: number) {
    const library = await this._serviceClass.getRecord({
      tableName: Tables.libraries,
      searchBy: LibraryColumns.id,
      value: id,
    });
    if (!library.rows.length) {
      throw new BadRequestError(
        `Library with id ${id} not found`,
        "LibraryManager"
      );
    }
    return library.rows[0];
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  public async addUser(userId: number): Promise<void> {
    const organizationId = asyncStorage.get("organizationId");
    const library = await this._serviceClass.getRecord({
      tableName: Tables.libraries,
      searchBy: LibraryColumns.id,
      value: organizationId,
    });
    if (!library.rows.length) {
      throw new BadRequestError(
        `Library with id ${organizationId} not found`,
        "LibraryManager"
      );
    }
    const user = await this._userManager.getUser(userId);
    if (!user) {
      throw new BadRequestError(
        `User with id ${userId} not found`,
        "LibraryManager"
      );
    }
    await this.addUserToOrganization(userId);
  }

  @RBACEnforce(AccessLevel.MODERATOR)
  private async addUserToOrganization(userId: number): Promise<RBACSchema> {
    const organizationId = asyncStorage.get("organizationId");
    const result = await this._DB.executeQuery<RBACSchema>(
      addUserToOrganizationQuery(userId, organizationId)
    );
    return result.rows[0];
  }

  private createLibraryFolder(libraryId: number): void {
    const baseDir = `./publications/${libraryId}`;
    const commonDir = `${baseDir}/common`;
    const authorsDir = `${baseDir}/authors`;

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    if (!fs.existsSync(commonDir)) {
      fs.mkdirSync(commonDir);
    }

    if (!fs.existsSync(authorsDir)) {
      fs.mkdirSync(authorsDir);
    }
  }

  private async canCreateLibrary(userId: number): Promise<boolean> {
    const userSubscription = await this._userManager.getUserSubscription(
      userId
    );
    const userOrganizations = await this._userManager.getUserOrganizations(
      userId
    );
    return (
      userOrganizations.length < userSubscription.organization_limit_number
    );
  }

  private deleteLibraryFolder(libraryId: number): void {
    fs.rmdirSync(`./publications/${libraryId}`);
  }
}
