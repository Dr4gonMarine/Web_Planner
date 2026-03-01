import { Badge } from '../ui/badge'
import type { Priority } from '../../types'

const STYLES: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
}

const LABELS: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={STYLES[priority]}>
      {LABELS[priority]}
    </Badge>
  )
}
