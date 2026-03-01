import { useState } from 'react'
import { useUIStore } from '../../store/useUIStore'
import { useCardStore } from '../../store/useCardStore'
import { useSubtaskTree } from '../../hooks/useSubtaskTree'
import { useCardActions } from '../../hooks/useCardActions'
import { SubtaskTree } from './SubtaskTree'
import { PriorityBadge } from '../shared/PriorityBadge'
import { StatusBadge } from '../shared/StatusBadge'
import { DueDateDisplay } from '../shared/DueDateDisplay'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { Button } from '../ui/button'
import { Pencil, Trash2, Plus, X, GitBranch } from 'lucide-react'
import { countDescendants } from '../../utils/treeUtils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function CardDetailPanel() {
  const { activeCardId, setActiveCard, openEditModal, openCreateModal } =
    useUIStore()
  const cards = useCardStore((state) => state.cards)
  const { removeCard } = useCardActions()
  const [showConfirm, setShowConfirm] = useState(false)

  if (!activeCardId) return null

  const card = cards.find((c) => c.id === activeCardId)
  if (!card) return null

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const treeRoot = useSubtaskTree(activeCardId)
  const descendantCount = countDescendants(activeCardId, cards)

  const handleDelete = async () => {
    setShowConfirm(false)
    await removeCard(card.id)
    setActiveCard(null)
  }

  const parent = card.parentId ? cards.find((c) => c.id === card.parentId) : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20"
        onClick={() => setActiveCard(null)}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-xl z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div className="flex-1 min-w-0 mr-2">
            <h2 className="text-base font-semibold leading-tight">{card.title}</h2>
            {parent && (
              <button
                className="text-xs text-muted-foreground hover:underline mt-0.5"
                onClick={() => setActiveCard(parent.id)}
              >
                ↳ {parent.title}
              </button>
            )}
          </div>
          <button
            onClick={() => setActiveCard(null)}
            className="p-1 rounded hover:bg-muted flex-shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={card.status} />
            {card.priority && <PriorityBadge priority={card.priority} />}
            {card.dueDate && <DueDateDisplay dueDate={card.dueDate} />}
          </div>

          {card.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Descrição
              </p>
              <p className="text-sm whitespace-pre-wrap">{card.description}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Criado em{' '}
            {format(new Date(card.createdAt), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditModal(card.id)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreateModal(card.id)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Subtarefa
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowConfirm(true)}
              className="ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Subtask tree */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Subtarefas
                {descendantCount > 0 && (
                  <span className="ml-1 normal-case">({descendantCount})</span>
                )}
              </p>
            </div>

            {treeRoot && treeRoot.children.length > 0 ? (
              <SubtaskTree nodes={treeRoot.children} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Sem subtarefas.{' '}
                <button
                  className="underline hover:no-underline"
                  onClick={() => openCreateModal(card.id)}
                >
                  Adicionar
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Excluir card"
        description={
          descendantCount > 0
            ? `Este card possui ${descendantCount} subtarefa${descendantCount !== 1 ? 's' : ''} que também serão excluídas. Deseja continuar?`
            : 'Tem certeza que deseja excluir este card?'
        }
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
