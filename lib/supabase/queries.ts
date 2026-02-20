'use server'

import { createClient } from '@/lib/supabase/server'
import type { AnalysisResponse, AnalysisHistoryRecord } from '@/lib/types'

/**
 * Save analysis result to database.
 * Silently returns null if Supabase is not configured or user is not logged in.
 */
export async function saveAnalysis(
  fileName: string,
  fileSize: number,
  analysisData: AnalysisResponse
) {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('analysis_history')
    .insert({
      user_id: user.id,
      file_name: fileName,
      file_size: fileSize,
      total_accounts: analysisData.summary.total_accounts_analyzed,
      suspicious_accounts: analysisData.summary.suspicious_accounts_flagged,
      fraud_rings_detected: analysisData.summary.fraud_rings_detected,
      processing_time_ms: Math.round(analysisData.summary.processing_time_seconds * 1000),
      analysis_data: analysisData as any,
      tags: [],
      notes: null,
      is_favorite: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving analysis:', error)
    return null
  }

  return data
}

/**
 * Get all analysis history for the current user.
 */
export async function getAnalysisHistory(): Promise<AnalysisHistoryRecord[]> {
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
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching analysis history:', error)
    return []
  }

  return (data as any[]) || []
}

/**
 * Get a single analysis by ID.
 */
export async function getAnalysisById(
  id: string
): Promise<AnalysisHistoryRecord | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching analysis:', error)
    return null
  }

  return data as any
}

/**
 * Delete an analysis by ID.
 */
export async function deleteAnalysis(id: string): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from('analysis_history')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting analysis:', error)
    return false
  }

  return true
}

/**
 * Get analysis statistics for the current user.
 */
export async function getAnalysisStats() {
  const defaultStats = {
    totalAnalyses: 0,
    totalSuspicious: 0,
    totalRings: 0,
    avgProcessingTime: 0,
  }

  const supabase = await createClient()
  if (!supabase) return defaultStats

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return defaultStats

  const { data, error } = await supabase
    .from('analysis_history')
    .select('suspicious_accounts, fraud_rings_detected, processing_time_ms')
    .eq('user_id', user.id)

  if (error || !data) return defaultStats

  const totalSuspicious = data.reduce(
    (sum, record) => sum + (record.suspicious_accounts ?? 0),
    0
  )
  const totalRings = data.reduce(
    (sum, record) => sum + (record.fraud_rings_detected ?? 0),
    0
  )
  const avgProcessingTime =
    data.length > 0
      ? data.reduce((sum, record) => sum + (record.processing_time_ms ?? 0), 0) /
        data.length
      : 0

  return {
    totalAnalyses: data.length,
    totalSuspicious,
    totalRings,
    avgProcessingTime: Math.round(avgProcessingTime),
  }
}

/**
 * Toggle favorite status for an analysis.
 */
export async function toggleAnalysisFavorite(
  id: string,
  isFavorite: boolean
): Promise<boolean> {
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

  return true
}

/**
 * Update tags for an analysis.
 */
export async function updateAnalysisTags(
  id: string,
  tags: string[]
): Promise<boolean> {
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

  return true
}

/**
 * Update notes for an analysis.
 */
export async function updateAnalysisNotes(
  id: string,
  notes: string | null
): Promise<boolean> {
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

  return true
}
