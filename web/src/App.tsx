import { useMemo, useState } from 'react'
import DataActions from './components/DataActions'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'
import StatsBar from './components/StatsBar'
import { useItems } from './hooks/useItems'
import { STATUS_OPTIONS, type ItemDraft } from './types'

export default function App() {
  const { items, addItem, updateItem, removeItem, replaceAll } = useItems()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [status, setStatus] = useState('全部')

  const editing = items.find((it) => it.id === editingId) ?? null

  const categories = useMemo(() => {
    const set = new Set(items.map((it) => it.category).filter(Boolean))
    return ['全部', ...[...set].sort((a, b) => a.localeCompare(b, 'zh-CN'))]
  }, [items])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      if (category !== '全部' && it.category !== category) return false
      if (status !== '全部' && it.status !== status) return false
      if (!q) return true
      const haystack = [it.name, it.location, it.notes, it.tags.join(' ')]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [items, query, category, status])

  const handleSubmit = (draft: ItemDraft) => {
    if (editing) {
      updateItem(editing.id, draft)
      setEditingId(null)
    } else {
      addItem(draft)
    }
  }

  const handleRemove = (id: string) => {
    const target = items.find((it) => it.id === id)
    if (!target) return
    if (!window.confirm(`确定删除「${target.name}」吗?`)) return
    removeItem(id)
    if (editingId === id) setEditingId(null)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page">
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1 className="app-title">Life Game</h1>
            <p className="app-subtitle">物品状态 · 记录你拥有的一切</p>
          </div>
          <DataActions items={items} onReplace={replaceAll} />
        </header>

        <StatsBar items={items} />

        <ItemForm
          key={editing?.id ?? 'new'}
          item={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditingId(null)}
        />

        <section className="list-section">
          <div className="toolbar">
            <input
              className="control toolbar__search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索名称、位置、备注、标签"
            />
            <select
              className="control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option === '全部' ? '全部分类' : option}
                </option>
              ))}
            </select>
            <select
              className="control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="全部">全部状态</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="toolbar__count">
              {visible.length} / {items.length} 条
            </span>
          </div>

          <ItemList items={visible} onEdit={handleEdit} onRemove={handleRemove} />
        </section>
      </div>
    </div>
  )
}
