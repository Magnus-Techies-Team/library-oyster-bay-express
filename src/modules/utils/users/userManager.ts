import { Inject, Service } from "fastify-decorators";
import { DB, DBToken } from "../../../db";
import ServiceClass, { serviceClassToken } from "../common/serviceClass";
import {
  BadRequestError,
  NotFoundError,
} from "../../../server/utils/common/errors/error";

export const userManagerToken = Symbol("userManagerToken");

@Service(userManagerToken)
export default class UserManager {
  @Inject(DBToken)
  private _DB!: DB;
  @Inject(serviceClassToken)
  private _serviceClass!: ServiceClass;
  public async createUser(userData: {
    login: string;
    password: string;
    email: string;
  }): Promise<any> {
    const emailMatcher =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (emailMatcher.exec(userData.email)) {
      const userCreated = await this._serviceClass.createRecord({
        tableName: "users",
        columnObject: userData,
      });
      delete userCreated.rows[0].password;
      return userCreated.rows[0];
    }
    throw new BadRequestError("Invalid email", "UserManager");
  }

  public async login(userData: {
    login: string;
    password: string;
  }): Promise<any> {
    const user = await this._serviceClass.getRecord({
      tableName: "users",
      searchBy: "login",
      value: userData.login,
    });
    if (userData.password !== user.rows[0].password) {
      throw new BadRequestError("Wrong password", "UserManager");
    } else {
      const data = { ...user.rows[0] };
      delete data.password;
      return data;
    }
  }

  public async getUser(id: string): Promise<any> {
    const query = `select login, email from Users where id='${id}'`;
    const result = await this._DB.executeQuery(query, []);
    if (!result.rows.length) {
      throw new NotFoundError("User not found", "UserManager");
    }
    return result.rows[0];
  }
}
