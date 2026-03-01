import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useUIStore } from '../../store/useUIStore'
import { useCardStore } from '../../store/useCardStore'
import { useCardActions } from '../../hooks/useCardActions'
import { getDescendantIds } from '../../utils/treeUtils'
import type { Priority, Status } from '../../types'

const PRIORITY_NONE = '__none__' as const
type PriorityOrNone = Priority | typeof PRIORITY_NONE

export function CardModal() {
  const { editingCardId, defaultParentId, closeModal, isModalOpen } =
    useUIStore()
  const cards = useCardStore((state) => state.cards)
  const { createCard, editCard } = useCardActions()

  const existingCard = editingCardId
    ? cards.find((c) => c.id === editingCardId)
    : null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<PriorityOrNone>(PRIORITY_NONE)
  const [status, setStatus] = useState<Status>('todo')
  const [parentId, setParentId] = useState<string | null>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTitle(existingCard?.title ?? '')
      setDescription(existingCard?.description ?? '')
      setDueDate(existingCard?.dueDate ?? '')
      setPriority(existingCard?.priority ?? PRIORITY_NONE)
      setStatus(existingCard?.status ?? 'todo')
      setParentId(existingCard?.parentId ?? defaultParentId ?? null)
    }
  }, [isModalOpen, editingCardId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cards that cannot be selected as parent
  const forbiddenParents = editingCardId
    ? getDescendantIds(editingCardId, cards).add(editingCardId)
    : new Set<string>()

  const eligibleParents = cards.filter((c) => !forbiddenParents.has(c.id))

  const handleSubmit = async () => {
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority: (priority === PRIORITY_NONE ? undefined : priority) as Priority | undefined,
      status,
      parentId,
    }

    if (existingCard) {
      await editCard(existingCard.id, payload)
    } else {
      await createCard(payload)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit()
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-lg" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {existingCard ? 'Editar Card' : 'Novo Card'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do card"
              autoFocus
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as Status)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Prioridade</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as PriorityOrNone)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhuma</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dueDate">Data limite</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Card pai (subtarefa de)</Label>
            <Select
              value={parentId ?? '__none__'}
              onValueChange={(v) =>
                setParentId(v === '__none__' ? null : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sem pai (card raiz)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sem pai (card raiz)</SelectItem>
                {eligibleParents.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {existingCard ? 'Salvar' : 'Criar Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
