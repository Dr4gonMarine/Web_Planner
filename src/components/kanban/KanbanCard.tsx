import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PriorityBadge } from '../shared/PriorityBadge'
import { DueDateDisplay } from '../shared/DueDateDisplay'
import { useUIStore } from '../../store/useUIStore'
import { useCardStore } from '../../store/useCardStore'
import { GitBranch, Pencil } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { Card } from '../../types'

interface Props {
  card: Card
  isOverlay?: boolean
}

export function KanbanCard({ card, isOverlay = false }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const { openEditModal, setActiveCard } = useUIStore()
  const allCards = useCardStore((state) => state.cards)
  const childCount = allCards.filter((c) => c.parentId === card.id).length

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-card border rounded-lg p-3 cursor-grab shadow-sm select-none group',
        isDragging && 'opacity-40',
        isOverlay && 'shadow-xl rotate-1 cursor-grabbing opacity-95'
      )}
      onClick={() => setActiveCard(card.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium line-clamp-2 flex-1">{card.title}</p>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation()
            openEditModal(card.id)
          }}
          title="Editar"
        >
          <Pencil className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {card.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {card.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {card.priority && <PriorityBadge priority={card.priority} />}
        {card.dueDate && <DueDateDisplay dueDate={card.dueDate} />}
        {childCount > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground ml-auto">
            <GitBranch className="w-3 h-3" />
            {childCount}
          </span>
        )}
      </div>
    </div>
  )
}
