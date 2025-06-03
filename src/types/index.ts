export interface Product {
  id: string;
  organization_id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  image_url: string;
  strain_type: 'sativa' | 'indica' | 'hybrid';
  genetics?: string;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  id: string;
  product_id: string;
  size_weight?: string;
  price: number;
  original_price?: number;
  thc_percentage: number;
  cbd_percentage?: number;
  total_cannabinoids?: number;
  terpene_profile: TerpeneProfile;
  inventory_level: number;
  is_available: boolean;
  batch_number?: string;
  harvest_date?: string;
  expiration_date?: string;
  lab_tested?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TerpeneProfile {
  myrcene?: number;
  limonene?: number;
  pinene?: number;
  caryophyllene?: number;
  terpinolene?: number;
  linalool?: number;
  humulene?: number;
  ocimene?: number;
  [key: string]: number | undefined;
}

export interface ProductWithVariant extends Product {
  variant: Variant;
}

export interface ProductMatch {
  product: ProductWithVariant;
  matchScore: number;
  effects: string[];
}

export interface VibesToTerpenes {
  [key: string]: {
    terpenes: { [key: string]: number };
    effects: string[];
  };
}

export interface SearchQuery {
  id: string;
  timestamp: string;
  user_type: 'kiosk' | 'staff';
  search_phrase: string;
  intent_tokens: string[];
  returned_product_ids: string[];
}

export interface Settings {
  api_key?: string;
  dispensary_id?: string;
  sync_frequency: 'manual' | '15min' | 'hourly' | 'daily';
  last_sync_timestamp?: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  details?: any;
}

export type UserRole = 'staff' | 'admin' | 'super_admin' | null;

export interface AuthState {
  role: UserRole;
  isInitialized: boolean;
  initializeAuth: () => void;
  logout: () => void;
}

export interface PineconeDocument {
  id?: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
  created_at?: string;
  status?: 'pending' | 'ingested' | 'failed' | 'deleted';
}