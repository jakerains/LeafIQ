export interface Terpene {
  id: string;
  name: string;
  aliases: string[] | null;
  aroma: string[];
  flavor: string[];
  common_sources: string[];
  effects: string[];
  usage_vibes: string[];
  therapeutic_notes: string | null;
  research: Array<{
    title: string;
    link: string;
    source: string;
  }> | null;
  default_intensity: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by?: string | null;
  organization_id?: string | null;
}

export interface TerpeneInsert {
  name: string;
  aliases?: string[] | null;
  aroma: string[];
  flavor: string[];
  common_sources: string[];
  effects: string[];
  usage_vibes: string[];
  therapeutic_notes?: string | null;
  research?: Array<{
    title: string;
    link: string;
    source: string;
  }> | null;
  default_intensity?: string | null;
  organization_id?: string | null;
}

export interface TerpeneUpdate extends Partial<TerpeneInsert> {
  id: string;
}

export interface TerpeneFilters {
  search?: string;
  effects?: string[];
  vibes?: string[];
  limit?: number;
  offset?: number;
} 