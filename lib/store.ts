import { create } from 'zustand'
import type { AnalysisResponse, AppError, GraphNode } from './types'

interface AppState {
  /** The uploaded CSV file */
  file: File | null
  /** Full API response data */
  analysisData: AnalysisResponse | null
  /** Whether an analysis is currently in progress */
  isLoading: boolean
  /** Current error state */
  error: AppError | null
  /** Currently selected graph node details */
  selectedNode: GraphNode | null
  /** Ring ID filter for graph visualization */
  filterRingId: string | null
  /** Risk score threshold filter */
  riskScoreThreshold: number
  /** Search term for account ID */
  searchAccountId: string

  /* Actions */
  setFile: (file: File | null) => void
  setAnalysisData: (data: AnalysisResponse | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: AppError | null) => void
  setSelectedNode: (node: GraphNode | null) => void
  setFilterRingId: (ringId: string | null) => void
  setRiskScoreThreshold: (threshold: number) => void
  setSearchAccountId: (search: string) => void
  reset: () => void
}

const initialState = {
  file: null,
  analysisData: null,
  isLoading: false,
  error: null,
  selectedNode: null,
  filterRingId: null,
  riskScoreThreshold: 0,
  searchAccountId: '',
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setFile: (file) => set({ file, error: null }),
  setAnalysisData: (analysisData) => set({ analysisData }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedNode: (selectedNode) => set({ selectedNode }),
  setFilterRingId: (filterRingId) => set({ filterRingId }),
  setRiskScoreThreshold: (riskScoreThreshold) => set({ riskScoreThreshold }),
  setSearchAccountId: (searchAccountId) => set({ searchAccountId }),
  reset: () => set(initialState),
}))
