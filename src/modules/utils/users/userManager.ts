import { Inject, Service } from "fastify-decorators";
import { DB, DBToken } from "../../../db";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import {
  BadRequestError,
  NotFoundError,
} from "../../../server/utils/common/errors/error";
import { Tables } from "../../../db/types/tables";
import {
  getUserOrganizationsQuery,
  getUserSubscriptionQuery,
  setBasicRoleQuery,
  setBasicSubscriptionQuery,
} from "./dbQueries";
import { LibrariesSchema } from "../../../db/types/tableSchemas/librariesSchema";
import { SubscriptionsSchema } from "../../../db/types/tableSchemas/subscriptionsSchema";
import { SubscriptionsUsersSchema } from "../../../db/types/tableSchemas/subscriptionsUsersSchema";
import { RBACSchema } from "../../../db/types/tableSchemas/RBACSchema";

export const userManagerToken = Symbol("userManagerToken");

@Service(userManagerToken)
export default class UserManager {
  @Inject(DBToken)
  private _DB!: DB;
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;
  public async createUser(userData: {
    first_name: string;
    last_name: string;
    password: string;
    email: string;
  }): Promise<any> {
    const emailMatcher =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (emailMatcher.exec(userData.email)) {
      const userCreated = await this._serviceClass.createRecord({
        tableName: Tables.users,
        columnObject: userData,
      });
      delete userCreated.rows[0].password;
      await this.setBasicSubscription(userCreated.rows[0].id);
      await this.setBasicRole(userCreated.rows[0].id);
      return userCreated.rows[0];
    }
    throw new BadRequestError("Invalid email", "UserManager");
  }

  public async login(userData: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this._serviceClass.getRecord({
      tableName: Tables.users,
      searchBy: "email",
      value: userData.email,
    });
    if (userData.password !== user.rows[0].password) {
      throw new BadRequestError("Wrong password", "UserManager");
    } else {
      const data = { ...user.rows[0] };
      delete data.password;
      return data;
    }
  }

  public async getUser(id: number): Promise<any> {
    const query = `select id, first_name, last_name, email from ${Tables.users} where id=${id}`;
    const result = await this._DB.executeQuery(query, []);
    if (!result.rows.length) {
      throw new NotFoundError("User not found", "UserManager");
    }
    return result.rows[0];
  }

  public async getUserSubscription(
    id: number
  ): Promise<SubscriptionsSchema & SubscriptionsUsersSchema> {
    const result = await this._DB.executeQuery<
      SubscriptionsSchema & SubscriptionsUsersSchema
    >(getUserSubscriptionQuery(id), []);
    if (!result.rows.length) {
      throw new NotFoundError("User not found", "UserManager");
    }
    return result.rows[0];
  }

  public async getUserOrganizations(id: number): Promise<LibrariesSchema[]> {
    const query = getUserOrganizationsQuery(id);
    const result = await this._DB.executeQuery<LibrariesSchema>(query, []);
    return result.rows;
  }

  public async setBasicRole(userId: number): Promise<RBACSchema[]> {
    const query = setBasicRoleQuery(userId);
    const result = await this._DB.executeQuery<RBACSchema>(query, []);
    return result.rows;
  }

  public async setBasicSubscription(
    userId: number
  ): Promise<SubscriptionsSchema[]> {
    const query = setBasicSubscriptionQuery(userId);
    const result = await this._DB.executeQuery<SubscriptionsSchema>(query, []);
    return result.rows;
  }
}
