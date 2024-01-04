export type PerUserOrganizationFileLimitsSchema = {
  id: number;
  user_id: number;
  organization_id: number;
  file_size_limit: number;
  created_at: string;
  updated_at: string;
};
