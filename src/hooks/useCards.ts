import { useEffect } from 'react'
import { cardRepository } from '../db/cardRepository'
import { useCardStore } from '../store/useCardStore'

export function useCards() {
  const { _setCards, isLoaded } = useCardStore()

  useEffect(() => {
    if (isLoaded) return
    cardRepository.getAll().then(_setCards)
  }, [isLoaded, _setCards])
}
