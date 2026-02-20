'use client'

import type { AnalysisResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
const TIMEOUT_MS = 120_000 // 2 minutes

/**
 * Check if the backend API is reachable
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Send a CSV file for analysis via POST /analyze.
 * Returns the parsed AnalysisResponse JSON on success.
 */
export async function analyzeTransactions(
  file: File,
): Promise<AnalysisResponse> {
  // First check if backend is reachable
  const isHealthy = await checkBackendHealth()
  if (!isHealthy) {
    throw new Error(
      `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is running on port 8001.`
    )
  }

  const formData = new FormData()
  formData.append('file', file)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(
        `Server error (${response.status}): ${errorText}`,
      )
    }

    const data: AnalysisResponse = await response.json()
    return data
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Download the analysis response as a JSON file.
 */
export function downloadJsonReport(data: AnalysisResponse): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'financial_forensics_report.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


/**
 * Download the analysis response as a CSV file.
 */
export async function downloadCsvReport(data: AnalysisResponse): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/export/csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to generate CSV export')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'fraud_analysis.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('CSV export error:', err)
    // Fallback to client-side CSV generation
    downloadCsvReportFallback(data)
  }
}

/**
 * Fallback client-side CSV generation if backend is unavailable.
 */
function downloadCsvReportFallback(data: AnalysisResponse): void {
  const rows: string[] = []
  
  // Suspicious Accounts section
  rows.push('Suspicious Accounts')
  rows.push('Account ID,Suspicion Score,Detected Patterns,Ring ID')
  data.suspicious_accounts.forEach(account => {
    rows.push(`${account.account_id},${account.suspicion_score},"${account.detected_patterns.join(', ')}",${account.ring_id || 'N/A'}`)
  })
  rows.push('')
  
  // Fraud Rings section
  rows.push('Fraud Rings')
  rows.push('Ring ID,Pattern Type,Risk Score,Member Accounts')
  data.fraud_rings.forEach(ring => {
    rows.push(`${ring.ring_id},${ring.pattern_type},${ring.risk_score},"${ring.member_accounts.join(', ')}"`)
  })
  rows.push('')
  
  // Summary section
  rows.push('Summary')
  rows.push('Metric,Value')
  rows.push(`Total Accounts Analyzed,${data.summary.total_accounts_analyzed}`)
  rows.push(`Suspicious Accounts Flagged,${data.summary.suspicious_accounts_flagged}`)
  rows.push(`Fraud Rings Detected,${data.summary.fraud_rings_detected}`)
  rows.push(`Processing Time (seconds),${data.summary.processing_time_seconds}`)
  
  const csv = rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'fraud_analysis.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
