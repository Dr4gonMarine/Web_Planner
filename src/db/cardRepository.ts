import { db } from './database'
import type { Card } from '../types'

async function deleteCardAndDescendants(id: string): Promise<void> {
  const children = await db.cards.where('parentId').equals(id).toArray()
  for (const child of children) {
    await deleteCardAndDescendants(child.id)
  }
  await db.cards.delete(id)
}

export const cardRepository = {
  async getAll(): Promise<Card[]> {
    return db.cards.orderBy('createdAt').toArray()
  },

  async create(card: Card): Promise<void> {
    await db.cards.add(card)
  },

  async update(id: string, changes: Partial<Card>): Promise<void> {
    await db.cards.update(id, { ...changes, updatedAt: Date.now() })
  },

  async delete(id: string): Promise<void> {
    await deleteCardAndDescendants(id)
  },

  async updateOrders(
    updates: Array<{ id: string; order: number; status: Card['status'] }>
  ): Promise<void> {
    await db.transaction('rw', db.cards, async () => {
      for (const u of updates) {
        await db.cards.update(u.id, {
          order: u.order,
          status: u.status,
          updatedAt: Date.now(),
        })
      }
    })
  },
}
