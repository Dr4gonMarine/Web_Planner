export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in_progress' | 'done'
export type ViewMode = 'kanban' | 'list'
export type SortField = 'createdAt' | 'dueDate' | 'priority'
export type SortDirection = 'asc' | 'desc'

export interface Card {
  id: string
  title: string
  description?: string
  dueDate?: string       // ISO "YYYY-MM-DD" or undefined
  priority?: Priority
  status: Status
  parentId: string | null
  createdAt: number      // Date.now()
  updatedAt: number
  order: number          // for ordering within a column
}

export interface CardTreeNode extends Card {
  children: CardTreeNode[]
}

export interface FilterState {
  status: Status | 'all'
  priority: Priority | 'all'
  searchText: string
}

export interface SortState {
  field: SortField
  direction: SortDirection
}
