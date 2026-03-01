import { useEffect } from 'react'
import { useCards } from './hooks/useCards'
import { AppLayout } from './components/layout/AppLayout'
import { KanbanBoard } from './components/kanban/KanbanBoard'
import { ListView } from './components/list/ListView'
import { CardModal } from './components/card/CardModal'
import { CardDetailPanel } from './components/card/CardDetailPanel'
import { useUIStore } from './store/useUIStore'

export default function App() {
  useCards() // Hydrate Zustand from IndexedDB on mount

  const viewMode = useUIStore((state) => state.viewMode)
  const isModalOpen = useUIStore((state) => state.isModalOpen)
  const activeCardId = useUIStore((state) => state.activeCardId)
  const closeModal = useUIStore((state) => state.closeModal)
  const setActiveCard = useUIStore((state) => state.setActiveCard)

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) closeModal()
        else if (activeCardId) setActiveCard(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, activeCardId, closeModal, setActiveCard])

  return (
    <AppLayout>
      {viewMode === 'kanban' ? <KanbanBoard /> : <ListView />}
      {isModalOpen && <CardModal />}
      {activeCardId && <CardDetailPanel />}
    </AppLayout>
  )
}
