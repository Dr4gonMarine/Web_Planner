import type { Card } from '../types'

export function getDescendantIds(cardId: string, cards: Card[]): Set<string> {
  const descendants = new Set<string>()
  const queue = [cardId]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const card of cards) {
      if (card.parentId === current) {
        descendants.add(card.id)
        queue.push(card.id)
      }
    }
  }
  return descendants
}

export function getRootCards(cards: Card[]): Card[] {
  return cards.filter((c) => c.parentId === null)
}

export function countDescendants(cardId: string, cards: Card[]): number {
  return getDescendantIds(cardId, cards).size
}
