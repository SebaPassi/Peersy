export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  student_id_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  condition: string;
  images: string[];
  status: 'active' | 'sold' | 'removed';
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Wishlist = {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listings?: Listing | null;
};

export type Review = {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  transaction_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
};
