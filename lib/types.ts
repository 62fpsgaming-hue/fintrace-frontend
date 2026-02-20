/** Represents a single suspicious account detected by the API */
export interface SuspiciousAccount {
  account_id: string
  suspicion_score: number
  detected_patterns: string[]
  ring_id: string | null
}

/** Represents a single transaction for timeline visualization */
export interface Transaction {
  transaction_id: string
  sender_id: string
  receiver_id: string
  amount: number
  timestamp: string
}

/** Represents a detected fraud ring cluster */
export interface FraudRing {
  ring_id: string
  pattern_type: string
  member_accounts: string[]
  risk_score: number
  member_count: number
}

/** Summary metrics returned from the analysis */
export interface AnalysisSummary {
  total_accounts_analyzed: number
  suspicious_accounts_flagged: number
  fraud_rings_detected: number
  processing_time_seconds: number
}

/** Full API response schema from POST /analyze */
export interface AnalysisResponse {
  suspicious_accounts: SuspiciousAccount[]
  fraud_rings: FraudRing[]
  summary: AnalysisSummary
  transactions?: Transaction[]
}

/** Node representation for graph visualization */
export interface GraphNode {
  id: string
  label: string
  isSuspicious: boolean
  suspicionScore: number
  detectedPatterns: string[]
  ringId: string | null
}

/** Edge representation for graph visualization */
export interface GraphEdge {
  from: string
  to: string
  amount?: number
  frequency?: number
  lastTransaction?: string
  totalAmount?: number
}

/** The shape of a CSV row for transaction data */
export interface TransactionRow {
  transaction_id: string
  sender_id: string
  receiver_id: string
  amount: number
  timestamp: string
}

/** Application error state */
export interface AppError {
  message: string
  type: 'validation' | 'network' | 'server' | 'timeout'
}

/** Record of a saved analysis in the database */
export interface AnalysisHistoryRecord {
  id: string
  user_id: string
  file_name: string
  file_size: number
  total_accounts: number
  suspicious_accounts: number
  fraud_rings_detected: number
  processing_time_ms: number
  analysis_data: AnalysisResponse
  tags: string[]
  notes: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

/** User profile information */
export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  organization: string | null
  role: string
  created_at: string
  updated_at: string
}

/** User settings and preferences */
export interface UserSettings {
  id: string
  user_id: string
  theme: string
  email_notifications: boolean
  analysis_notifications: boolean
  auto_save_results: boolean
  default_view: string
  created_at: string
  updated_at: string
}

/** Saved filter configuration */
export interface SavedFilter {
  id: string
  user_id: string
  name: string
  description: string | null
  filter_config: Record<string, any>
  is_default: boolean
  created_at: string
  updated_at: string
}

/** Activity log entry */
export interface ActivityLogEntry {
  id: string
  user_id: string
  action: string
  resource_type: string | null
  resource_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

/** User statistics from view */
export interface UserStatistics {
  user_id: string
  total_analyses: number
  total_suspicious: number
  total_rings: number
  avg_processing_time: number
  last_analysis_date: string
  favorite_count: number
}
