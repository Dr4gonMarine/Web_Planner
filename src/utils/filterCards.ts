import type { Card, FilterState } from '../types'

export function filterCards(cards: Card[], filters: FilterState): Card[] {
  return cards.filter((card) => {
    if (filters.status !== 'all' && card.status !== filters.status) return false
    if (filters.priority !== 'all' && card.priority !== filters.priority) return false
    if (filters.searchText) {
      const lower = filters.searchText.toLowerCase()
      if (!card.title.toLowerCase().includes(lower)) return false
    }
    return true
  })
}
