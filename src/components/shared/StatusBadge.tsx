import { Badge } from '../ui/badge'
import type { Status } from '../../types'

const LABELS: Record<Status, string> = {
  todo: 'A Fazer',
  in_progress: 'Em Andamento',
  done: 'Concluído',
}

const STYLES: Record<Status, string> = {
  todo: 'bg-gray-100 text-gray-600 border-gray-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  done: 'bg-green-100 text-green-700 border-green-200',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={STYLES[status]}>
      {LABELS[status]}
    </Badge>
  )
}
