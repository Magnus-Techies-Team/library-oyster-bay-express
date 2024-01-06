import {
  RequestHeadersDefault,
  RequestParamsDefault,
  RequestBodyDefault,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterfaceCreatePublication {
  Body: {
    name: string;
    description: string;
    owner_id: number;
  };
  Querystring?: {
    organizationId: number;
  };
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

interface RequestGenericInterfaceGetOrganizationPublications {
  Body: RequestBodyDefault;
  Querystring?: {
    organization_id: number;
  };
  Params: {
    id: number;
  };
  Headers?: RequestHeadersDefault;
}

interface RequestGenericInterfaceApprovePublication {
  Body: {
    id: number;
  };
  Querystring?: {
    organizationId: number;
  };
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
}

interface RequestGenericInterfaceGetPublicationContent {
  Body: RequestBodyDefault;
  Querystring: {
    organization_id: number;
  };
  Params: {
    id: number;
  };
  Headers?: RequestHeadersDefault;
}

export interface RouteGenericInterfaceCreatePublication
  extends RequestGenericInterfaceCreatePublication,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceGetOrganizationPublications
  extends RequestGenericInterfaceGetOrganizationPublications,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceApprovePublication
  extends RequestGenericInterfaceApprovePublication,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceGetPublicationContent
  extends RequestGenericInterfaceGetPublicationContent,
    ReplyGenericInterface {}
