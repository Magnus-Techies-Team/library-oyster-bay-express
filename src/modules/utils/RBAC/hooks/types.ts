import {
  RequestBodyDefault,
  RequestHeadersDefault,
  RequestParamsDefault,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterfaceWithOrganizationId {
  Body?: RequestBodyDefault;
  Querystring: {
    organizationId: number;
  };
  Params?: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceWithOrganizationId
  extends RequestGenericInterfaceWithOrganizationId,
    ReplyGenericInterface {}
