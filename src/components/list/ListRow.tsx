import { PriorityBadge } from '../shared/PriorityBadge'
import { StatusBadge } from '../shared/StatusBadge'
import { DueDateDisplay } from '../shared/DueDateDisplay'
import { useUIStore } from '../../store/useUIStore'
import { useCardStore } from '../../store/useCardStore'
import { GitBranch, Pencil } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { Card } from '../../types'

interface Props {
  card: Card
}

export function ListRow({ card }: Props) {
  const { setActiveCard, openEditModal } = useUIStore()
  const allCards = useCardStore((state) => state.cards)
  const childCount = allCards.filter((c) => c.parentId === card.id).length
  const parent = card.parentId
    ? allCards.find((c) => c.id === card.parentId)
    : null

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer group transition-colors',
        card.status === 'done' && 'opacity-60'
      )}
      onClick={() => setActiveCard(card.id)}
    >
      {/* Indent for subtasks */}
      {card.parentId && (
        <span className="w-4 flex-shrink-0 text-muted-foreground">↳</span>
      )}

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            card.status === 'done' && 'line-through text-muted-foreground'
          )}
        >
          {card.title}
        </p>
        {parent && (
          <p className="text-xs text-muted-foreground truncate">
            em {parent.title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {childCount > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <GitBranch className="w-3 h-3" />
            {childCount}
          </span>
        )}
        {card.priority && <PriorityBadge priority={card.priority} />}
        {card.dueDate && <DueDateDisplay dueDate={card.dueDate} />}
        <StatusBadge status={card.status} />
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation()
            openEditModal(card.id)
          }}
          title="Editar"
        >
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
