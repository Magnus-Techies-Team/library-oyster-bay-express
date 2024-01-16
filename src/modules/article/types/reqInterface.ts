import {
  RequestHeadersDefault,
  RequestParamsDefault,
  RequestBodyDefault,
} from "fastify";
import { ReplyGenericInterface } from "fastify/types/reply";

interface RequestGenericInterfaceCreatePublication {
  Body: {
    title: string;
    description: string;
    price: number;
    year: number;
  };
  Querystring?: {
    organizationId: number;
  };
  Params: RequestParamsDefault;
  Headers?: RequestHeadersDefault;
  upload: () => any;
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

interface RequestGenericInterfaceChangePublicationState {
  Body: {
    id: number;
    isPublic: boolean;
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

export interface RouteGenericInterfaceChangePublicationState
  extends RequestGenericInterfaceChangePublicationState,
    ReplyGenericInterface {}

export interface RouteGenericInterfaceGetPublicationContent
  extends RequestGenericInterfaceGetPublicationContent,
    ReplyGenericInterface {}
