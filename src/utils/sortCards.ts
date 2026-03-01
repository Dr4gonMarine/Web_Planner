import type { Card, SortState } from '../types'

const PRIORITY_WEIGHT = { low: 1, medium: 2, high: 3 }

export function sortCards(cards: Card[], sort: SortState): Card[] {
  return [...cards].sort((a, b) => {
    let cmp = 0
    switch (sort.field) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) cmp = 0
        else if (!a.dueDate) cmp = 1
        else if (!b.dueDate) cmp = -1
        else cmp = a.dueDate.localeCompare(b.dueDate)
        break
      case 'priority':
        cmp =
          (PRIORITY_WEIGHT[b.priority ?? 'low'] ?? 1) -
          (PRIORITY_WEIGHT[a.priority ?? 'low'] ?? 1)
        break
      case 'createdAt':
      default:
        cmp = a.createdAt - b.createdAt
    }
    return sort.direction === 'asc' ? cmp : -cmp
  })
}
