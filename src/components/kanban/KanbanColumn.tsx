import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import { useUIStore } from '../../store/useUIStore'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { Card, Status } from '../../types'

const COLUMN_COLORS: Record<Status, string> = {
  todo: 'bg-slate-50 border-slate-200',
  in_progress: 'bg-purple-50 border-purple-200',
  done: 'bg-green-50 border-green-200',
}

const HEADER_COLORS: Record<Status, string> = {
  todo: 'text-slate-600',
  in_progress: 'text-purple-600',
  done: 'text-green-600',
}

interface Props {
  column: { id: Status; label: string }
  cards: Card[]
}

export function KanbanColumn({ column, cards }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const openCreateModal = useUIStore((state) => state.openCreateModal)

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2
          className={cn(
            'font-semibold text-sm uppercase tracking-wide',
            HEADER_COLORS[column.id]
          )}
        >
          {column.label}
        </h2>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {cards.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 flex flex-col gap-2 min-h-[120px] p-2 rounded-lg border',
          COLUMN_COLORS[column.id],
          isOver && 'ring-2 ring-ring ring-offset-1'
        )}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Arraste um card aqui
          </p>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="mt-1 text-muted-foreground hover:text-foreground justify-start"
          onClick={() => openCreateModal()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar card
        </Button>
      </div>
    </div>
  )
}
