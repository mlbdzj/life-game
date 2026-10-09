import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEY, loadItems } from '../lib/items'
import type { Item, ItemDraft } from '../types'

export function useItems() {
  const [items, setItems] = useState<Item[]>(loadItems)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((draft: ItemDraft) => {
    const now = new Date().toISOString()
    const item: Item = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    setItems((prev) => [item, ...prev])
  }, [])

  const updateItem = useCallback((id: string, draft: ItemDraft) => {
    const now = new Date().toISOString()
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...draft, updatedAt: now } : it)),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  const replaceAll = useCallback((next: Item[]) => {
    setItems(next)
  }, [])

  return { items, addItem, updateItem, removeItem, replaceAll }
}
