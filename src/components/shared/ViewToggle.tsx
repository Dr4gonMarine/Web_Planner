import { LayoutGrid, List } from 'lucide-react'
import { Button } from '../ui/button'
import { useUIStore } from '../../store/useUIStore'

export function ViewToggle() {
  const { viewMode, setViewMode } = useUIStore()

  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button
        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('kanban')}
        className="rounded-none border-0"
        title="Kanban"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('list')}
        className="rounded-none border-0 border-l"
        title="Lista"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
}
