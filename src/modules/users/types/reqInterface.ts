import {
  RequestHeadersDefault,
  RequestQuerystringDefault,
  RequestParamsDefault,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterfaceCreateUser {
  Body: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  Querystring?: RequestQuerystringDefault;
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

interface RequestGenericInterfaceLogin {
  Body: {
    email: string;
    password: string;
  };
  Querystring?: RequestQuerystringDefault;
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceCreateUser
  extends RequestGenericInterfaceCreateUser,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceLogin
  extends RequestGenericInterfaceLogin,
    ReplyGenericInterface {}
  