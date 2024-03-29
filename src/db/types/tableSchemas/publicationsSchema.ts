export type PublicationsSchema = {
  id: number;
  title: string;
  description: string;
  user_id: number;
  is_public: boolean;
  is_approved: boolean;
  library_id: string;
  price: number;
  filepath: string;
  year: number;
  created_at: string;
  updated_at: string;
};
