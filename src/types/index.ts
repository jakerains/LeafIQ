export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image_url: string;
  thc_percentage: number;
  cbd_percentage: number;
  price: number;
  created_at: string;
  strain_type: 'sativa' | 'indica' | 'hybrid';
}

export interface Variant {
  id: string;
  product_id: string;
  strain_type: 'sativa' | 'indica' | 'hybrid';
  terpene_profile: TerpeneProfile;
  inventory_level: number;
  last_updated: string;
  is_available: boolean;
  size?: string;
  weight?: string;
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

export type UserRole = 'staff' | 'admin' | null;

export interface AuthState {
  role: UserRole;
  isInitialized: boolean;
  initializeAuth: () => void;
  login: (role: UserRole, passcode: string) => boolean;
  logout: () => void;
}