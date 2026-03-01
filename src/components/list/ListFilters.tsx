import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useUIStore } from '../../store/useUIStore'
import { Search, X } from 'lucide-react'
import { Button } from '../ui/button'

export function ListFilters() {
  const { filters, sort, setFilters, setSort } = useUIStore()

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.searchText !== ''

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cards..."
          value={filters.searchText}
          onChange={(e) => setFilters({ searchText: e.target.value })}
          className="pl-8 w-48"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(v) => setFilters({ status: v as typeof filters.status })}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="todo">A Fazer</SelectItem>
          <SelectItem value="in_progress">Em Andamento</SelectItem>
          <SelectItem value="done">Concluído</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(v) =>
          setFilters({ priority: v as typeof filters.priority })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as prioridades</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="low">Baixa</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={`${sort.field}-${sort.direction}`}
        onValueChange={(v) => {
          const [field, direction] = v.split('-') as [
            typeof sort.field,
            typeof sort.direction,
          ]
          setSort({ field, direction })
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-asc">Criação (mais antigo)</SelectItem>
          <SelectItem value="createdAt-desc">Criação (mais recente)</SelectItem>
          <SelectItem value="dueDate-asc">Data limite (mais cedo)</SelectItem>
          <SelectItem value="dueDate-desc">Data limite (mais tarde)</SelectItem>
          <SelectItem value="priority-desc">Prioridade (maior primeiro)</SelectItem>
          <SelectItem value="priority-asc">Prioridade (menor primeiro)</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setFilters({ status: 'all', priority: 'all', searchText: '' })
          }
          className="text-muted-foreground"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  )
}
