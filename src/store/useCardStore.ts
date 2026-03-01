import { create } from 'zustand'
import { cardRepository } from '../db/cardRepository'
import type { Card } from '../types'

function collectDescendantIds(rootId: string, cards: Card[]): Set<string> {
  const result = new Set<string>([rootId])
  const queue = [rootId]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const card of cards) {
      if (card.parentId === current) {
        result.add(card.id)
        queue.push(card.id)
      }
    }
  }
  return result
}

interface CardStore {
  cards: Card[]
  isLoaded: boolean
  _setCards: (cards: Card[]) => void
  addCard: (card: Card) => Promise<void>
  updateCard: (id: string, changes: Partial<Card>) => Promise<void>
  deleteCard: (id: string) => Promise<void>
  reorderCards: (
    updates: Array<{ id: string; order: number; status: Card['status'] }>
  ) => Promise<void>
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  isLoaded: false,

  _setCards: (cards) => set({ cards, isLoaded: true }),

  addCard: async (card) => {
    await cardRepository.create(card)
    set((state) => ({ cards: [...state.cards, card] }))
  },

  updateCard: async (id, changes) => {
    await cardRepository.update(id, changes)
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, ...changes, updatedAt: Date.now() } : c
      ),
    }))
  },

  deleteCard: async (id) => {
    const allCards = get().cards
    const idsToDelete = collectDescendantIds(id, allCards)
    await cardRepository.delete(id)
    set((state) => ({
      cards: state.cards.filter((c) => !idsToDelete.has(c.id)),
    }))
  },

  reorderCards: async (updates) => {
    await cardRepository.updateOrders(updates)
    set((state) => {
      const map = new Map(updates.map((u) => [u.id, u]))
      return {
        cards: state.cards.map((c) => {
          const upd = map.get(c.id)
          return upd ? { ...c, order: upd.order, status: upd.status } : c
        }),
      }
    })
  },
}))
