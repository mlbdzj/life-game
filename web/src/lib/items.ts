import { STATUS_OPTIONS, type Item, type ItemStatus } from '../types'

export const STORAGE_KEY = 'life-game:items:v1'

export type Backup = {
  version: number
  exportedAt: string
  items: Item[]
}

export function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? coerceList(parsed) : []
  } catch {
    // 数据损坏时不要崩,退回空列表
    return []
  }
}

/** 把一条任意 JSON 收敛成合法的 Item;名称缺失则丢弃 */
function coerceItem(raw: unknown): Item | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>

  const name = typeof r.name === 'string' ? r.name.trim() : ''
  if (!name) return null

  const now = new Date().toISOString()
  const status =
    typeof r.status === 'string' && STATUS_OPTIONS.includes(r.status as ItemStatus)
      ? (r.status as ItemStatus)
      : STATUS_OPTIONS[0]

  const quantityNumber = Number(r.quantity)
  const priceNumber = Number(r.price)

  return {
    id: typeof r.id === 'string' && r.id ? r.id : crypto.randomUUID(),
    name,
    category: typeof r.category === 'string' && r.category.trim() ? r.category.trim() : '其他',
    status,
    quantity: Number.isFinite(quantityNumber) ? Math.max(1, Math.floor(quantityNumber)) : 1,
    price: r.price == null || r.price === '' || !Number.isFinite(priceNumber) ? null : priceNumber,
    purchaseDate: typeof r.purchaseDate === 'string' ? r.purchaseDate : '',
    location: typeof r.location === 'string' ? r.location : '',
    tags: Array.isArray(r.tags) ? r.tags.filter((t): t is string => typeof t === 'string') : [],
    notes: typeof r.notes === 'string' ? r.notes : '',
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : now,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : now,
  }
}

function coerceList(raw: unknown[]): Item[] {
  return raw.map(coerceItem).filter((it): it is Item => it !== null)
}

/** 解析备份文件:既接受 { items: [...] } 也接受裸数组。格式不对就抛错。 */
export function parseBackup(text: string): Item[] {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('不是合法的 JSON 文件')
  }

  const list = Array.isArray(data)
    ? data
    : typeof data === 'object' && data !== null && Array.isArray((data as { items?: unknown }).items)
      ? ((data as { items: unknown[] }).items)
      : null

  if (!list) throw new Error('找不到 items 数组')
  return coerceList(list)
}

export function toBackup(items: Item[]): Backup {
  return { version: 1, exportedAt: new Date().toISOString(), items }
}

export function downloadBackup(items: Item[]) {
  const blob = new Blob([JSON.stringify(toBackup(items), null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `life-game-items-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/** 按 id 合并:导入的条目覆盖同 id 的旧条目,其余保留 */
export function mergeById(current: Item[], incoming: Item[]): Item[] {
  const map = new Map(current.map((item) => [item.id, item]))
  for (const item of incoming) map.set(item.id, item)
  return [...map.values()]
}
