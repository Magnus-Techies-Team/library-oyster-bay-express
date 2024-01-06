import {
  RequestHeadersDefault,
  RequestQuerystringDefault,
  RequestParamsDefault,
  RequestBodyDefault,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterfaceCreateLibrary {
  Body: {
    name: string,
    description: string,
    owner_id?: number
  };
  Querystring?: RequestQuerystringDefault;
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

interface RequestGenericInterfaceGetLibrary {
  Body: RequestBodyDefault;
  Querystring?: {
    id: number
  };
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceCreateLibrary
  extends RequestGenericInterfaceCreateLibrary,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceGetLibrary
  extends RequestGenericInterfaceGetLibrary,
    ReplyGenericInterface {}
  