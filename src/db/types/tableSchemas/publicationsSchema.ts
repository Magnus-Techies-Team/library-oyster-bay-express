export type PublicationsSchema = {
  id: number;
  title: string;
  user_id: string;
  is_public: boolean;
  is_approved: boolean;
  library_id: string;
  price: number;
  filepath: string;
  year: number;
  created_at: string;
  updated_at: string;
};
