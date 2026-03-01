import { useCardStore } from '../store/useCardStore'
import { useUIStore } from '../store/useUIStore'
import type { Card } from '../types'

export function useCardActions() {
  const { addCard, updateCard, deleteCard } = useCardStore()
  const { closeModal } = useUIStore()

  const createCard = async (
    data: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ) => {
    const card: Card = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: Date.now(),
    }
    await addCard(card)
    closeModal()
  }

  const editCard = async (id: string, changes: Partial<Card>) => {
    await updateCard(id, changes)
    closeModal()
  }

  const removeCard = async (id: string) => {
    await deleteCard(id)
  }

  return { createCard, editCard, removeCard }
}
