import { ListFilters } from './ListFilters'
import { ListRow } from './ListRow'
import { useCardStore } from '../../store/useCardStore'
import { useUIStore } from '../../store/useUIStore'
import { filterCards } from '../../utils/filterCards'
import { sortCards } from '../../utils/sortCards'
import { ClipboardList } from 'lucide-react'

export function ListView() {
  const cards = useCardStore((state) => state.cards)
  const { filters, sort } = useUIStore()

  const visible = sortCards(filterCards(cards, filters), sort)

  return (
    <div className="max-w-4xl mx-auto">
      <ListFilters />

      <div className="flex flex-col border rounded-lg mt-4 bg-card overflow-hidden">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ClipboardList className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Nenhum card encontrado</p>
          </div>
        ) : (
          <div className="divide-y">
            {visible.map((card) => (
              <ListRow key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
