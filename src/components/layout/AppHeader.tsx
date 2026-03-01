import { ViewToggle } from '../shared/ViewToggle'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

export function AppHeader() {
  const openCreateModal = useUIStore((state) => state.openCreateModal)

  return (
    <header className="border-b px-4 py-3 flex items-center justify-between bg-background sticky top-0 z-10">
      <h1 className="text-xl font-bold tracking-tight">Planner</h1>
      <div className="flex items-center gap-3">
        <ViewToggle />
        <Button onClick={() => openCreateModal()} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Novo Card
        </Button>
      </div>
    </header>
  )
}
