import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { useCardStore } from '../../store/useCardStore'
import type { Card, Status } from '../../types'

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo', label: 'A Fazer' },
  { id: 'in_progress', label: 'Em Andamento' },
  { id: 'done', label: 'Concluído' },
]

function isColumnId(id: string): id is Status {
  return ['todo', 'in_progress', 'done'].includes(id)
}

export function KanbanBoard() {
  const { cards, reorderCards } = useCardStore()
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  // Only root cards in Kanban
  const rootCards = cards.filter((c) => c.parentId === null)

  const getCardsForColumn = (status: Status) =>
    rootCards
      .filter((c) => c.status === status)
      .sort((a, b) => a.order - b.order)

  const handleDragStart = ({ active }: DragStartEvent) => {
    const card = rootCards.find((c) => c.id === active.id)
    setActiveCard(card ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeCardItem = rootCards.find((c) => c.id === activeId)
    if (!activeCardItem) return

    let targetStatus: Status = activeCardItem.status

    if (isColumnId(overId)) {
      targetStatus = overId
    } else {
      const overCard = rootCards.find((c) => c.id === overId)
      if (overCard) targetStatus = overCard.status
    }

    const columnCards = rootCards
      .filter((c) => c.status === targetStatus)
      .sort((a, b) => a.order - b.order)

    let newColumnCards: Card[]

    if (activeCardItem.status === targetStatus) {
      // Reorder within same column
      const oldIndex = columnCards.findIndex((c) => c.id === activeId)
      const newIndex = columnCards.findIndex((c) => c.id === overId)
      if (oldIndex === -1 || newIndex === -1) return
      newColumnCards = arrayMove(columnCards, oldIndex, newIndex)
    } else {
      // Move to a different column
      const withoutActive = columnCards.filter((c) => c.id !== activeId)
      const overIndex = withoutActive.findIndex((c) => c.id === overId)
      newColumnCards = [...withoutActive]
      newColumnCards.splice(
        overIndex === -1 ? withoutActive.length : overIndex,
        0,
        activeCardItem
      )
    }

    const updates = newColumnCards.map((c, i) => ({
      id: c.id,
      order: i * 1000,
      status: targetStatus,
    }))

    reorderCards(updates)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    const activeCardItem = rootCards.find((c) => c.id === activeId)
    if (!activeCardItem) return

    if (isColumnId(overId) && activeCardItem.status !== overId) {
      // Optimistic visual update — actual DB write happens on dragEnd
      useCardStore.setState((state) => ({
        cards: state.cards.map((c) =>
          c.id === activeId ? { ...c, status: overId } : c
        ),
      }))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={getCardsForColumn(col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard && <KanbanCard card={activeCard} isOverlay />}
      </DragOverlay>
    </DndContext>
  )
}
