import type { AnalysisResponse, GraphNode, GraphEdge, SuspiciousAccount, FraudRing, Transaction } from './types'

/**
 * Build a lookup map of suspicious accounts keyed by account_id.
 */
function buildSuspiciousMap(accounts: SuspiciousAccount[]): Map<string, SuspiciousAccount> {
  const map = new Map<string, SuspiciousAccount>()
  for (const acct of accounts) {
    map.set(acct.account_id, acct)
  }
  return map
}

/**
 * Build a lookup map to find the ring_id(s) each account belongs to.
 */
function buildRingMembershipMap(rings: FraudRing[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const ring of rings) {
    for (const memberId of ring.member_accounts) {
      map.set(memberId, ring.ring_id)
    }
  }
  return map
}

/**
 * Extract all unique account IDs from fraud rings,
 * suspicious accounts, and transactions to create graph nodes.
 */
export function formatGraphNodes(data: AnalysisResponse): GraphNode[] {
  const suspiciousMap = buildSuspiciousMap(data.suspicious_accounts)
  const ringMap = buildRingMembershipMap(data.fraud_rings)

  const allAccountIds = new Set<string>()

  // Add suspicious accounts
  for (const acct of data.suspicious_accounts) {
    allAccountIds.add(acct.account_id)
  }

  // Add ring members
  for (const ring of data.fraud_rings) {
    for (const memberId of ring.member_accounts) {
      allAccountIds.add(memberId)
    }
  }

  // Add accounts from transactions
  if (data.transactions) {
    for (const txn of data.transactions) {
      allAccountIds.add(txn.sender_id)
      allAccountIds.add(txn.receiver_id)
    }
  }

  const nodes: GraphNode[] = []
  for (const id of allAccountIds) {
    const suspicious = suspiciousMap.get(id)
    nodes.push({
      id,
      label: id,
      isSuspicious: !!suspicious,
      suspicionScore: suspicious?.suspicion_score ?? 0,
      detectedPatterns: suspicious?.detected_patterns ?? [],
      ringId: ringMap.get(id) ?? suspicious?.ring_id ?? null,
    })
  }

  return nodes
}

/**
 * Create edges from transaction data if available,
 * otherwise fall back to ring-based connections.
 */
export function formatGraphEdges(data: AnalysisResponse): GraphEdge[] {
  const edges: GraphEdge[] = []

  // If we have transaction data, use it to build edges
  if (data.transactions && data.transactions.length > 0) {
    // Group transactions by sender-receiver pair
    const edgeMap = new Map<string, {
      from: string
      to: string
      totalAmount: number
      frequency: number
      lastTransaction: string
    }>()

    for (const txn of data.transactions) {
      const key = `${txn.sender_id}->${txn.receiver_id}`
      const existing = edgeMap.get(key)
      
      if (existing) {
        existing.totalAmount += txn.amount
        existing.frequency += 1
        // Keep the most recent timestamp
        if (new Date(txn.timestamp) > new Date(existing.lastTransaction)) {
          existing.lastTransaction = txn.timestamp
        }
      } else {
        edgeMap.set(key, {
          from: txn.sender_id,
          to: txn.receiver_id,
          totalAmount: txn.amount,
          frequency: 1,
          lastTransaction: txn.timestamp,
        })
      }
    }

    // Convert map to edges array
    for (const edge of edgeMap.values()) {
      edges.push(edge)
    }
  } else {
    // Fallback: Create edges between members of the same fraud ring
    for (const ring of data.fraud_rings) {
      const members = ring.member_accounts
      // Create a chain between ring members to show the ring pattern
      for (let i = 0; i < members.length - 1; i++) {
        edges.push({
          from: members[i],
          to: members[i + 1],
        })
      }
      // Close the ring if it has more than 2 members
      if (members.length > 2) {
        edges.push({
          from: members[members.length - 1],
          to: members[0],
        })
      }
    }
  }

  return edges
}
