import { AccessLevel } from "../customTypes";

export type RolesSchema = {
  id: string;
  title: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
};
