import { useState, type FormEvent } from 'react'
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  type Item,
  type ItemDraft,
  type ItemStatus,
} from '../types'

type ItemFormProps = {
  /** 传入物品表示编辑,传 null 表示新增 */
  item: Item | null
  onSubmit: (draft: ItemDraft) => void
  onCancel: () => void
}

export default function ItemForm({ item, onSubmit, onCancel }: ItemFormProps) {
  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState(item?.category ?? CATEGORY_OPTIONS[0])
  const [status, setStatus] = useState<ItemStatus>(item?.status ?? STATUS_OPTIONS[0])
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1))
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : '')
  const [purchaseDate, setPurchaseDate] = useState(item?.purchaseDate ?? '')
  const [location, setLocation] = useState(item?.location ?? '')
  const [tags, setTags] = useState(item?.tags.join(', ') ?? '')
  const [notes, setNotes] = useState(item?.notes ?? '')
  const [error, setError] = useState('')

  const isEditing = item !== null

  const reset = () => {
    setName('')
    setCategory(CATEGORY_OPTIONS[0])
    setStatus(STATUS_OPTIONS[0])
    setQuantity('1')
    setPrice('')
    setPurchaseDate('')
    setLocation('')
    setTags('')
    setNotes('')
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('请填写物品名称')
      return
    }
    setError('')

    const parsedQuantity = Math.max(1, Math.floor(Number(quantity) || 1))
    const parsedPrice = price.trim() === '' ? null : Math.max(0, Number(price) || 0)

    onSubmit({
      name: trimmedName,
      category: category.trim() || '其他',
      status,
      quantity: parsedQuantity,
      price: parsedPrice,
      purchaseDate,
      location: location.trim(),
      tags: tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
      notes: notes.trim(),
    })

    if (!isEditing) reset()
  }

  return (
    <form onSubmit={handleSubmit} className="card item-form">
      <div className="item-form__head">
        <h2 className="item-form__title">{isEditing ? `编辑:${item.name}` : '新增物品'}</h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="link-btn link-btn--muted"
          >
            取消编辑
          </button>
        )}
      </div>

      <div className="form-grid">
        <div className="field field--name">
          <label className="form-label" htmlFor="item-name">
            名称 *
          </label>
          <input
            id="item-name"
            className="control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如:MacBook Pro 14"
            autoFocus
          />
        </div>

        <div className="field">
          <label className="form-label" htmlFor="item-category">
            分类
          </label>
          <input
            id="item-category"
            className="control"
            list="category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="选择或输入"
          />
          <datalist id="category-options">
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>

        <div className="field">
          <label className="form-label" htmlFor="item-status">
            状态
          </label>
          <select
            id="item-status"
            className="control"
            value={status}
            onChange={(e) => setStatus(e.target.value as ItemStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="form-label" htmlFor="item-quantity">
            数量
          </label>
          <input
            id="item-quantity"
            type="number"
            min={1}
            className="control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="form-label" htmlFor="item-price">
            购买单价 (¥)
          </label>
          <input
            id="item-price"
            type="number"
            min={0}
            step="0.01"
            className="control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="留空表示未知"
          />
        </div>

        <div className="field">
          <label className="form-label" htmlFor="item-date">
            购买日期
          </label>
          <input
            id="item-date"
            type="date"
            className="control"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="form-label" htmlFor="item-location">
            存放位置
          </label>
          <input
            id="item-location"
            className="control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例如:书房"
          />
        </div>

        <div className="field field--tags">
          <label className="form-label" htmlFor="item-tags">
            标签
          </label>
          <input
            id="item-tags"
            className="control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="用逗号分隔,例如:工作, 主力机"
          />
        </div>

        <div className="field field--notes">
          <label className="form-label" htmlFor="item-notes">
            备注
          </label>
          <textarea
            id="item-notes"
            rows={2}
            className="control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="保修、序列号、来源等"
          />
        </div>
      </div>

      <div className="item-form__actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? '保存修改' : '添加'}
        </button>
        {error && <span className="form-error">{error}</span>}
      </div>
    </form>
  )
}
