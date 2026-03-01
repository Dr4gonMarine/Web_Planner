import { create } from 'zustand'
import type { FilterState, SortState, ViewMode } from '../types'

interface UIStore {
  viewMode: ViewMode
  filters: FilterState
  sort: SortState
  activeCardId: string | null
  editingCardId: string | null
  isModalOpen: boolean
  defaultParentId: string | null

  setViewMode: (mode: ViewMode) => void
  setFilters: (filters: Partial<FilterState>) => void
  setSort: (sort: Partial<SortState>) => void
  openCreateModal: (parentId?: string | null) => void
  openEditModal: (cardId: string) => void
  closeModal: () => void
  setActiveCard: (cardId: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'kanban',
  filters: { status: 'all', priority: 'all', searchText: '' },
  sort: { field: 'createdAt', direction: 'asc' },
  activeCardId: null,
  editingCardId: null,
  isModalOpen: false,
  defaultParentId: null,

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setSort: (sort) =>
    set((state) => ({ sort: { ...state.sort, ...sort } })),

  openCreateModal: (parentId = null) =>
    set({ isModalOpen: true, editingCardId: null, defaultParentId: parentId }),

  openEditModal: (cardId) =>
    set({ isModalOpen: true, editingCardId: cardId, defaultParentId: null }),

  closeModal: () =>
    set({ isModalOpen: false, editingCardId: null, defaultParentId: null }),

  setActiveCard: (cardId) => set({ activeCardId: cardId }),
}))
