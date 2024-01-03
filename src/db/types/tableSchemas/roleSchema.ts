import { AccessLevel } from "../customTypes";

export type RoleSchema = {
  id: string;
  title: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
};
