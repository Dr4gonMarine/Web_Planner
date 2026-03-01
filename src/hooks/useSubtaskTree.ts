import { useMemo } from 'react'
import { useCardStore } from '../store/useCardStore'
import type { Card, CardTreeNode } from '../types'

function buildNode(card: Card, all: Card[]): CardTreeNode {
  const children = all
    .filter((c) => c.parentId === card.id)
    .sort((a, b) => a.order - b.order)
    .map((child) => buildNode(child, all))
  return { ...card, children }
}

export function useSubtaskTree(rootId: string): CardTreeNode | null {
  const cards = useCardStore((state) => state.cards)

  return useMemo(() => {
    const root = cards.find((c) => c.id === rootId)
    if (!root) return null
    return buildNode(root, cards)
  }, [cards, rootId])
}
