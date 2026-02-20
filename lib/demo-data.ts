import type { AnalysisResponse } from './types'

/**
 * Demo data matching the API response schema.
 * Used when no backend is connected to showcase the dashboard.
 */
export const DEMO_RESPONSE: AnalysisResponse = {
  suspicious_accounts: [
    {
      account_id: 'ACC-4821',
      suspicion_score: 95,
      detected_patterns: ['rapid layering', 'structuring', 'round-trip'],
      ring_id: 'RING-001',
    },
    {
      account_id: 'ACC-3157',
      suspicion_score: 91,
      detected_patterns: ['rapid layering', 'fan-out'],
      ring_id: 'RING-001',
    },
    {
      account_id: 'ACC-7294',
      suspicion_score: 87,
      detected_patterns: ['structuring', 'smurfing'],
      ring_id: 'RING-002',
    },
    {
      account_id: 'ACC-1056',
      suspicion_score: 82,
      detected_patterns: ['round-trip', 'velocity spike'],
      ring_id: 'RING-001',
    },
    {
      account_id: 'ACC-6638',
      suspicion_score: 78,
      detected_patterns: ['fan-out', 'dormant activation'],
      ring_id: 'RING-002',
    },
    {
      account_id: 'ACC-9912',
      suspicion_score: 74,
      detected_patterns: ['structuring'],
      ring_id: 'RING-003',
    },
    {
      account_id: 'ACC-2200',
      suspicion_score: 69,
      detected_patterns: ['velocity spike', 'smurfing'],
      ring_id: 'RING-002',
    },
    {
      account_id: 'ACC-5543',
      suspicion_score: 62,
      detected_patterns: ['rapid layering'],
      ring_id: 'RING-003',
    },
    {
      account_id: 'ACC-8871',
      suspicion_score: 55,
      detected_patterns: ['fan-out'],
      ring_id: null,
    },
    {
      account_id: 'ACC-3389',
      suspicion_score: 48,
      detected_patterns: ['dormant activation'],
      ring_id: 'RING-003',
    },
    {
      account_id: 'ACC-1472',
      suspicion_score: 42,
      detected_patterns: ['velocity spike'],
      ring_id: null,
    },
    {
      account_id: 'ACC-7710',
      suspicion_score: 35,
      detected_patterns: ['structuring'],
      ring_id: null,
    },
  ],
  fraud_rings: [
    {
      ring_id: 'RING-001',
      pattern_type: 'Layered Round-Trip',
      risk_score: 94,
      member_accounts: ['ACC-4821', 'ACC-3157', 'ACC-1056', 'ACC-0488'],
      member_count: 4,
    },
    {
      ring_id: 'RING-002',
      pattern_type: 'Structuring Network',
      risk_score: 85,
      member_accounts: ['ACC-7294', 'ACC-6638', 'ACC-2200', 'ACC-0112', 'ACC-0334'],
      member_count: 5,
    },
    {
      ring_id: 'RING-003',
      pattern_type: 'Fan-Out Cluster',
      risk_score: 68,
      member_accounts: ['ACC-9912', 'ACC-5543', 'ACC-3389'],
      member_count: 3,
    },
  ],
  summary: {
    total_accounts_analyzed: 1247,
    suspicious_accounts_flagged: 12,
    fraud_rings_detected: 3,
    processing_time_seconds: 2.47,
  },
  transactions: [
    // RING-001 transactions (Layered Round-Trip)
    { transaction_id: 'TX001', sender_id: 'ACC-4821', receiver_id: 'ACC-3157', amount: 25000, timestamp: '2026-02-15T08:00:00' },
    { transaction_id: 'TX002', sender_id: 'ACC-3157', receiver_id: 'ACC-1056', amount: 24500, timestamp: '2026-02-15T08:05:00' },
    { transaction_id: 'TX003', sender_id: 'ACC-1056', receiver_id: 'ACC-0488', amount: 24000, timestamp: '2026-02-15T08:10:00' },
    { transaction_id: 'TX004', sender_id: 'ACC-0488', receiver_id: 'ACC-4821', amount: 23500, timestamp: '2026-02-15T08:15:00' },
    
    // RING-002 transactions (Structuring Network)
    { transaction_id: 'TX005', sender_id: 'ACC-7294', receiver_id: 'ACC-0112', amount: 9900, timestamp: '2026-02-16T09:00:00' },
    { transaction_id: 'TX006', sender_id: 'ACC-6638', receiver_id: 'ACC-0112', amount: 9900, timestamp: '2026-02-16T09:00:01' },
    { transaction_id: 'TX007', sender_id: 'ACC-2200', receiver_id: 'ACC-0112', amount: 9900, timestamp: '2026-02-16T09:00:02' },
    { transaction_id: 'TX008', sender_id: 'ACC-0112', receiver_id: 'ACC-0334', amount: 29500, timestamp: '2026-02-16T09:05:00' },
    { transaction_id: 'TX009', sender_id: 'ACC-0334', receiver_id: 'ACC-7294', amount: 10000, timestamp: '2026-02-16T09:10:00' },
    { transaction_id: 'TX010', sender_id: 'ACC-0334', receiver_id: 'ACC-6638', amount: 9500, timestamp: '2026-02-16T09:10:01' },
    { transaction_id: 'TX011', sender_id: 'ACC-0334', receiver_id: 'ACC-2200', amount: 9500, timestamp: '2026-02-16T09:10:02' },
    
    // RING-003 transactions (Fan-Out Cluster)
    { transaction_id: 'TX012', sender_id: 'ACC-9912', receiver_id: 'ACC-5543', amount: 15000, timestamp: '2026-02-17T10:00:00' },
    { transaction_id: 'TX013', sender_id: 'ACC-9912', receiver_id: 'ACC-3389', amount: 15000, timestamp: '2026-02-17T10:00:01' },
    { transaction_id: 'TX014', sender_id: 'ACC-5543', receiver_id: 'ACC-3389', amount: 14500, timestamp: '2026-02-17T10:05:00' },
    
    // Additional suspicious transactions
    { transaction_id: 'TX015', sender_id: 'ACC-8871', receiver_id: 'ACC-1472', amount: 50000, timestamp: '2026-02-18T11:00:00' },
    { transaction_id: 'TX016', sender_id: 'ACC-1472', receiver_id: 'ACC-7710', amount: 49500, timestamp: '2026-02-18T11:05:00' },
    { transaction_id: 'TX017', sender_id: 'ACC-7710', receiver_id: 'ACC-8871', amount: 49000, timestamp: '2026-02-18T11:10:00' },
    
    // Normal transactions for context
    { transaction_id: 'TX018', sender_id: 'ACC-1000', receiver_id: 'ACC-2000', amount: 500, timestamp: '2026-02-15T12:00:00' },
    { transaction_id: 'TX019', sender_id: 'ACC-2000', receiver_id: 'ACC-3000', amount: 750, timestamp: '2026-02-15T14:00:00' },
    { transaction_id: 'TX020', sender_id: 'ACC-3000', receiver_id: 'ACC-4000', amount: 1200, timestamp: '2026-02-16T10:00:00' },
  ],
}
