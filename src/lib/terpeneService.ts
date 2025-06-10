import { supabase } from './supabase';
import type { Terpene, TerpeneInsert, TerpeneUpdate, TerpeneFilters } from '../types/terpene';

/**
 * Helper function to normalize terpene data from database
 */
function normalizeTerpene(rawTerpene: Record<string, unknown>): Terpene {
  return {
    ...rawTerpene,
    aliases: rawTerpene.aliases || [],
    therapeutic_notes: rawTerpene.therapeutic_notes || '',
    research: rawTerpene.research || [],
    default_intensity: rawTerpene.default_intensity || 'moderate',
  };
}

/**
 * Get current user session info for audit trails
 */
async function getCurrentUserInfo() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { userId: null, organizationId: null };
  }

  // Get user profile for organization context
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  return {
    userId: user.id,
    organizationId: profile?.organization_id || null
  };
}

export class TerpeneService {
  /**
   * Get all terpenes with optional filtering - includes organization context
   */
  static async getTerpenes(filters: TerpeneFilters = {}): Promise<{ data: Terpene[]; count: number }> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*', { count: 'exact' });

    // Global terpenes (no organization) OR user's organization terpenes
    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      // If no user/organization, only show global terpenes
      query = query.is('organization_id', null);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,therapeutic_notes.ilike.%${filters.search}%`);
    }

    // Apply effects filter
    if (filters.effects && filters.effects.length > 0) {
      query = query.overlaps('effects', filters.effects);
    }

    // Apply vibes filter
    if (filters.vibes && filters.vibes.length > 0) {
      query = query.overlaps('usage_vibes', filters.vibes);
    }

    // Apply pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    // Order by name
    query = query.order('name');

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching terpenes: ${error.message}`);
    }

    const normalizedData = (data || []).map(normalizeTerpene);
    return { data: normalizedData, count: count || 0 };
  }

  /**
   * Get a single terpene by ID
   */
  static async getTerpene(id: string): Promise<Terpene> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*')
      .eq('id', id);

    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      query = query.is('organization_id', null);
    }

    const { data, error } = await query.single();

    if (error) {
      throw new Error(`Error fetching terpene: ${error.message}`);
    }

    return normalizeTerpene(data);
  }

  /**
   * Create a new terpene - requires authentication
   */
  static async createTerpene(terpene: TerpeneInsert): Promise<Terpene> {
    const { userId, organizationId } = await getCurrentUserInfo();
    
    if (!userId) {
      throw new Error('Authentication required to create terpenes');
    }

    const terpeneData = {
      ...terpene,
      created_by: userId,
      organization_id: organizationId
    };

    const { data, error } = await supabase
      .from('terpenes')
      .insert(terpeneData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating terpene: ${error.message}`);
    }

    return normalizeTerpene(data);
  }

  /**
   * Update an existing terpene - requires authentication and ownership
   */
  static async updateTerpene(terpene: TerpeneUpdate): Promise<Terpene> {
    const { userId, organizationId } = await getCurrentUserInfo();
    
    if (!userId) {
      throw new Error('Authentication required to update terpenes');
    }

    const { id, ...updates } = terpene;
    
    // Check if user can modify this terpene (either created by them or in their org)
    const { data: existingTerpene } = await supabase
      .from('terpenes')
      .select('created_by, organization_id')
      .eq('id', id)
      .single();

    if (existingTerpene) {
      const canModify = existingTerpene.created_by === userId || 
                       existingTerpene.organization_id === organizationId ||
                       existingTerpene.organization_id === null; // Global terpenes can be modified by anyone
      
      if (!canModify) {
        throw new Error('Insufficient permissions to update this terpene');
      }
    }
    
    const { data, error } = await supabase
      .from('terpenes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating terpene: ${error.message}`);
    }

    return normalizeTerpene(data);
  }

  /**
   * Delete a terpene - requires authentication and ownership
   */
  static async deleteTerpene(id: string): Promise<void> {
    const { userId, organizationId } = await getCurrentUserInfo();
    
    if (!userId) {
      throw new Error('Authentication required to delete terpenes');
    }

    // Check if user can delete this terpene
    const { data: existingTerpene } = await supabase
      .from('terpenes')
      .select('created_by, organization_id')
      .eq('id', id)
      .single();

    if (existingTerpene) {
      const canDelete = existingTerpene.created_by === userId || 
                       (existingTerpene.organization_id === organizationId && organizationId !== null);
      
      if (!canDelete) {
        throw new Error('Insufficient permissions to delete this terpene');
      }
    }

    const { error } = await supabase
      .from('terpenes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting terpene: ${error.message}`);
    }
  }

  /**
   * Search terpenes by name or effects
   */
  static async searchTerpenes(query: string): Promise<Terpene[]> {
    const { organizationId } = await getCurrentUserInfo();
    
    let dbQuery = supabase
      .from('terpenes')
      .select('*')
      .or(`name.ilike.%${query}%,effects.cs.{${query}},usage_vibes.cs.{${query}}`)
      .order('name')
      .limit(20);

    if (organizationId) {
      dbQuery = dbQuery.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      dbQuery = dbQuery.is('organization_id', null);
    }

    const { data, error } = await dbQuery;

    if (error) {
      throw new Error(`Error searching terpenes: ${error.message}`);
    }

    return (data || []).map(normalizeTerpene);
  }

  /**
   * Get terpenes by effects (for recommendation engine)
   */
  static async getTerpenesByEffects(effects: string[]): Promise<Terpene[]> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*')
      .overlaps('effects', effects)
      .order('name');

    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      query = query.is('organization_id', null);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching terpenes by effects: ${error.message}`);
    }

    return (data || []).map(normalizeTerpene);
  }

  /**
   * Get terpenes by usage vibes (for recommendation engine)
   */
  static async getTerpenesByVibes(vibes: string[]): Promise<Terpene[]> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*')
      .overlaps('usage_vibes', vibes)
      .order('name');

    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      query = query.is('organization_id', null);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching terpenes by vibes: ${error.message}`);
    }

    return (data || []).map(normalizeTerpene);
  }

  /**
   * Bulk import terpenes - admin feature
   */
  static async bulkImportTerpenes(terpenes: TerpeneInsert[]): Promise<{ success: number; errors: string[] }> {
    const { userId, organizationId } = await getCurrentUserInfo();
    
    if (!userId) {
      throw new Error('Authentication required for bulk import');
    }

    const results = { success: 0, errors: [] as string[] };

    for (const terpene of terpenes) {
      try {
        const terpeneData = {
          ...terpene,
          created_by: userId,
          organization_id: organizationId
        };

        await supabase
          .from('terpenes')
          .insert(terpeneData);
        
        results.success++;
      } catch (error) {
        results.errors.push(`Failed to import ${terpene.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  /**
   * Export terpenes for the current organization
   */
  static async exportTerpenes(): Promise<Terpene[]> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*')
      .order('name');

    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      query = query.is('organization_id', null);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error exporting terpenes: ${error.message}`);
    }

    return (data || []).map(normalizeTerpene);
  }

  /**
   * Get terpene analytics for dashboard
   */
  static async getTerpeneAnalytics(): Promise<{
    total: number;
    byEffects: Record<string, number>;
    byVibes: Record<string, number>;
    recentlyAdded: Terpene[];
  }> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*')
      .order('created_at', { ascending: false });

    // Get all accessible terpenes
    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      query = query.is('organization_id', null);
    }

    const { data: terpenes, error } = await query;

    if (error) {
      throw new Error(`Error fetching analytics: ${error.message}`);
    }

    const normalizedTerpenes = (terpenes || []).map(normalizeTerpene);

    // Count by effects
    const byEffects: Record<string, number> = {};
    const byVibes: Record<string, number> = {};

    normalizedTerpenes.forEach(terpene => {
      terpene.effects.forEach(effect => {
        byEffects[effect] = (byEffects[effect] || 0) + 1;
      });
      
      terpene.usage_vibes.forEach(vibe => {
        byVibes[vibe] = (byVibes[vibe] || 0) + 1;
      });
    });

    return {
      total: normalizedTerpenes.length,
      byEffects,
      byVibes,
      recentlyAdded: normalizedTerpenes.slice(0, 5)
    };
  }

  /**
   * Get terpene recommendations based on product strain type or user preferences
   */
  static async getRecommendations(params: {
    strainType?: 'indica' | 'sativa' | 'hybrid';
    desiredEffects?: string[];
    desiredVibes?: string[];
    limit?: number;
  }): Promise<Terpene[]> {
    const { organizationId } = await getCurrentUserInfo();
    
    let query = supabase
      .from('terpenes')
      .select('*');

    if (organizationId) {
      query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
    } else {
      query = query.is('organization_id', null);
    }

    // Build recommendations based on strain type common terpenes
    if (params.strainType) {
      const strainTerpenes = {
        indica: ['Myrcene', 'Linalool', 'Caryophyllene'],
        sativa: ['Limonene', 'Pinene', 'Terpinolene'],
        hybrid: ['Myrcene', 'Limonene', 'Caryophyllene', 'Pinene']
      };
      
      query = query.in('name', strainTerpenes[params.strainType]);
    }

    // Filter by desired effects
    if (params.desiredEffects && params.desiredEffects.length > 0) {
      query = query.overlaps('effects', params.desiredEffects);
    }

    // Filter by desired vibes
    if (params.desiredVibes && params.desiredVibes.length > 0) {
      query = query.overlaps('usage_vibes', params.desiredVibes);
    }

    query = query.limit(params.limit || 10);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error getting recommendations: ${error.message}`);
    }

    return (data || []).map(normalizeTerpene);
  }
} 