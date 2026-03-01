import { format, isPast, parseISO, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  dueDate: string
}

export function DueDateDisplay({ dueDate }: Props) {
  const date = parseISO(dueDate)
  const overdue = isPast(date) && !isToday(date)
  const today = isToday(date)

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs',
        overdue && 'text-red-600',
        today && 'text-orange-500',
        !overdue && !today && 'text-muted-foreground'
      )}
    >
      <Calendar className="w-3 h-3" />
      {format(date, "d 'de' MMM", { locale: ptBR })}
    </span>
  )
}
