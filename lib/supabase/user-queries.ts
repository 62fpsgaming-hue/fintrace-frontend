'use server'

import { createClient } from '@/lib/supabase/server'
import type { UserProfile, UserSettings, SavedFilter, ActivityLogEntry } from '@/lib/types'

// ============================================================================
// USER PROFILE QUERIES
// ============================================================================

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    // Table might not exist yet OR no profile row exists - return a default profile
    if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist') || !error.message) {
      return {
        id: user.id,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        organization: null,
        role: 'user',
        created_at: user.created_at,
        updated_at: user.created_at,
      }
    }
    console.error('Error fetching user profile:', error)
    return null
  }

  // If no data returned, create default profile
  if (!data) {
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      organization: null,
      role: 'user',
      created_at: user.created_at,
      updated_at: user.created_at,
    }
  }

  return data as UserProfile
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<UserProfile | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    return null
  }

  // Log activity
  await logActivity('profile_updated', 'user_profile', user.id, updates)

  return data as UserProfile
}

// ============================================================================
// USER SETTINGS QUERIES
// ============================================================================

/**
 * Get the current user's settings
 */
export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // Table might not exist yet OR no settings row exists - return default settings
    if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist') || !error.message) {
      return {
        id: user.id,
        user_id: user.id,
        theme: 'system',
        email_notifications: true,
        analysis_notifications: true,
        auto_save_results: true,
        default_view: 'graph',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    console.error('Error fetching user settings:', error)
    return null
  }

  // If no data returned, create default settings
  if (!data) {
    return {
      id: user.id,
      user_id: user.id,
      theme: 'system',
      email_notifications: true,
      analysis_notifications: true,
      auto_save_results: true,
      default_view: 'graph',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  return data as UserSettings
}

/**
 * Update the current user's settings
 */
export async function updateUserSettings(
  updates: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserSettings | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user settings:', error)
    return null
  }

  // Log activity
  await logActivity('settings_updated', 'user_settings', user.id, updates)

  return data as UserSettings
}

// ============================================================================
// SAVED FILTERS QUERIES
// ============================================================================

/**
 * Get all saved filters for the current user
 */
export async function getSavedFilters(): Promise<SavedFilter[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('saved_filters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved filters:', error)
    return []
  }

  return (data as SavedFilter[]) || []
}

/**
 * Create a new saved filter
 */
export async function createSavedFilter(
  name: string,
  description: string | null,
  filterConfig: Record<string, any>,
  isDefault: boolean = false
): Promise<SavedFilter | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // If this is set as default, unset other defaults
  if (isDefault) {
    await supabase
      .from('saved_filters')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data, error } = await supabase
    .from('saved_filters')
    .insert({
      user_id: user.id,
      name,
      description,
      filter_config: filterConfig,
      is_default: isDefault,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating saved filter:', error)
    return null
  }

  // Log activity
  await logActivity('filter_created', 'saved_filter', data.id, { name })

  return data as SavedFilter
}

/**
 * Delete a saved filter
 */
export async function deleteSavedFilter(id: string): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('saved_filters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting saved filter:', error)
    return false
  }

  // Log activity
  await logActivity('filter_deleted', 'saved_filter', id)

  return true
}

// ============================================================================
// ACTIVITY LOG QUERIES
// ============================================================================

/**
 * Log an activity
 */
export async function logActivity(
  action: string,
  resourceType: string | null = null,
  resourceId: string | null = null,
  metadata: Record<string, any> | null = null
): Promise<void> {
  const supabase = await createClient()
  if (!supabase) return

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('activity_log').insert({
    user_id: user.id,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    metadata,
  })
}

/**
 * Get recent activity for the current user
 */
export async function getRecentActivity(limit: number = 20): Promise<ActivityLogEntry[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching activity log:', error)
    return []
  }

  return (data as ActivityLogEntry[]) || []
}

// ============================================================================
// ANALYSIS HISTORY ENHANCED QUERIES
// ============================================================================

/**
 * Toggle favorite status for an analysis
 */
export async function toggleAnalysisFavorite(id: string, isFavorite: boolean): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('analysis_history')
    .update({ is_favorite: isFavorite })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error toggling favorite:', error)
    return false
  }

  // Log activity
  await logActivity(
    isFavorite ? 'analysis_favorited' : 'analysis_unfavorited',
    'analysis_history',
    id
  )

  return true
}

/**
 * Update analysis tags
 */
export async function updateAnalysisTags(id: string, tags: string[]): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('analysis_history')
    .update({ tags })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating tags:', error)
    return false
  }

  // Log activity
  await logActivity('analysis_tags_updated', 'analysis_history', id, { tags })

  return true
}

/**
 * Update analysis notes
 */
export async function updateAnalysisNotes(id: string, notes: string): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('analysis_history')
    .update({ notes })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating notes:', error)
    return false
  }

  // Log activity
  await logActivity('analysis_notes_updated', 'analysis_history', id)

  return true
}

/**
 * Get favorite analyses
 */
export async function getFavoriteAnalyses() {
  const supabase = await createClient()
  if (!supabase) return []

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorite analyses:', error)
    return []
  }

  return data || []
}

/**
 * Search analyses by tags
 */
export async function searchAnalysesByTags(tags: string[]) {
  const supabase = await createClient()
  if (!supabase) return []

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('user_id', user.id)
    .overlaps('tags', tags)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching analyses by tags:', error)
    return []
  }

  return data || []
}
