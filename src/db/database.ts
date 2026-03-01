import Dexie, { type Table } from 'dexie'
import type { Card } from '../types'

export class PlannerDatabase extends Dexie {
  cards!: Table<Card>

  constructor() {
    super('PlannerDB')
    this.version(1).stores({
      cards: '&id, status, parentId, priority, createdAt, order',
    })
  }
}

export const db = new PlannerDatabase()
